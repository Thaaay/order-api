const { getDb } = require('../config/database');

class OrderModel {
  /**
   * Busca todos os pedidos com seus itens.
   * @returns {Promise<Array>} Lista de pedidos
   * @throws {Error} Se o banco não estiver inicializado
   */
  async findAll() {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');

    const orders = await db.all(`
      SELECT o.*, 
             json_group_array(
               json_object('idItem', oi.idItem, 'quantidadeItem', oi.quantidadeItem, 'valorItem', oi.valorItem)
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      GROUP BY o.id
      ORDER BY o.created_at DESC
    `);
    
    return orders.map(order => ({
      ...order,
      items: JSON.parse(order.items || '[]')
    }));
  }

  /**
   * Busca um pedido pelo ID.
   * @param {number} id - ID do pedido
   * @returns {Promise<Object|null>} Pedido encontrado ou null
   */
  async findById(id) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');

    const order = await db.get(`
      SELECT o.*, 
             json_group_array(
               json_object('idItem', oi.idItem, 'quantidadeItem', oi.quantidadeItem, 'valorItem', oi.valorItem)
             ) as items
      FROM orders o
      LEFT JOIN order_items oi ON o.id = oi.order_id
      WHERE o.id = ?
      GROUP BY o.id
    `, id);

    if (!order) return null;

    return {
      ...order,
      items: JSON.parse(order.items || '[]')
    };
  }

  /**
   * Cria um novo pedido com seus itens.
   * @param {Object} orderData - Dados do pedido
   * @returns {Promise<Object>} Pedido criado
   */
  async create(orderData) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');

    const { numeroPedido, valorTotal, dataCriacao, items } = orderData;

    // Inicia uma transação
    await db.run('BEGIN TRANSACTION');

    try {
      const result = await db.run(
        `INSERT INTO orders (numeroPedido, valorTotal, dataCriacao) VALUES (?, ?, ?)`,
        [numeroPedido, valorTotal, dataCriacao]
      );

      const orderId = result.lastID;

      for (const item of items) {
        await db.run(
          `INSERT INTO order_items (order_id, idItem, quantidadeItem, valorItem) VALUES (?, ?, ?, ?)`,
          [orderId, item.idItem, item.quantidadeItem, item.valorItem]
        );
      }

      await db.run('COMMIT');
      return this.findById(orderId);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }

  /**
   * Atualiza um pedido existente (substituição completa).
   * @param {number} id - ID do pedido
   * @param {Object} orderData - Novos dados do pedido
   * @returns {Promise<Object|null>} Pedido atualizado ou null se não existir
   */
  async update(id, orderData) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');

    const { numeroPedido, valorTotal, dataCriacao, items } = orderData;

    // Verifica se o pedido existe
    const existing = await this.findById(id);
    if (!existing) return null;

    await db.run('BEGIN TRANSACTION');

    try {
      // Atualiza a tabela orders
      await db.run(
        `UPDATE orders SET numeroPedido = ?, valorTotal = ?, dataCriacao = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?`,
        [numeroPedido, valorTotal, dataCriacao, id]
      );

      // Remove os itens antigos
      await db.run(`DELETE FROM order_items WHERE order_id = ?`, id);

      // Insere os novos itens
      for (const item of items) {
        await db.run(
          `INSERT INTO order_items (order_id, idItem, quantidadeItem, valorItem) VALUES (?, ?, ?, ?)`,
          [id, item.idItem, item.quantidadeItem, item.valorItem]
        );
      }

      await db.run('COMMIT');
      return this.findById(id);
    } catch (error) {
      await db.run('ROLLBACK');
      throw error;
    }
  }

  async update(id, orderData) {
  const db = getDb();
  if (!db) throw new Error('Banco de dados não inicializado');

  const { numeroPedido, valorTotal, dataCriacao, items } = orderData;

  // Iniciar transação
  await db.run('BEGIN TRANSACTION');

  try {
    // Atualizar o pedido
    const result = await db.run(
      `UPDATE orders
       SET numeroPedido = ?, valorTotal = ?, dataCriacao = ?, updated_at = CURRENT_TIMESTAMP
       WHERE id = ?`,
      [numeroPedido, valorTotal, dataCriacao, id]
    );

    if (result.changes === 0) {
      await db.run('ROLLBACK');
      return null; // Pedido não encontrado
    }

    // Remover itens antigos
    await db.run('DELETE FROM order_items WHERE order_id = ?', [id]);

    // Inserir novos itens
    for (const item of items) {
      await db.run(
        `INSERT INTO order_items (order_id, idItem, quantidadeItem, valorItem)
         VALUES (?, ?, ?, ?)`,
        [id, item.idItem, item.quantidadeItem, item.valorItem]
      );
    }

    await db.run('COMMIT');

    // Retornar o pedido atualizado
    return this.findById(id);
  } catch (error) {
    await db.run('ROLLBACK');
    throw error;
  }
}

  /**
   * Remove um pedido pelo ID.
   * @param {number} id - ID do pedido
   * @returns {Promise<boolean>} true se removido
   */
  async delete(id) {
    const db = getDb();
    if (!db) throw new Error('Database not initialized');

    const result = await db.run('DELETE FROM orders WHERE id = ?', id);
    return result.changes > 0; // retorna true se algum registro foi afetado
  }
}

module.exports = OrderModel;