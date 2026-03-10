const OrderModel = require('../models/orderModel');

const orderModel = new OrderModel();

// GET /api/orders
const getOrders = async (req, res) => {
  try {
    const orders = await orderModel.findAll();
    res.json(orders);
  } catch (error) {
    console.error('Erro ao buscar pedidos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// GET /api/orders/:id
const getOrderById = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const order = await orderModel.findById(id);
    if (!order) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.json(order);
  } catch (error) {
    console.error('Erro ao buscar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// POST /api/orders
const createOrder = async (req, res) => {
  try {
    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validações
    const validationError = validateOrderData(req.body);
    if (validationError) {
      return res.status(400).json({ error: validationError });
    }

    const newOrder = await orderModel.create(req.body);
    res.status(201).json(newOrder);
  } catch (error) {
    console.error('Erro ao criar pedido:', error);
    // Verificar se é erro de chave duplicada (numeroPedido único?) - se tiver índice único
    if (error.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ error: 'Número do pedido já existe' });
    }
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// PUT /api/orders/:id
const updateOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const { numeroPedido, valorTotal, dataCriacao, items } = req.body;

    // Validações
    if (!numeroPedido || !valorTotal || !dataCriacao || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        error: 'Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items (array não vazio)'
      });
    }

    for (const item of items) {
      if (!item.idItem || !item.quantidadeItem || !item.valorItem) {
        return res.status(400).json({
          error: 'Cada item deve ter idItem, quantidadeItem e valorItem'
        });
      }
    }
// DELETE /api/orders/:id
const deleteOrder = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    if (isNaN(id) || id <= 0) {
      return res.status(400).json({ error: 'ID inválido' });
    }

    const deleted = await orderModel.delete(id);
    if (!deleted) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.status(204).send();
  } catch (error) {
    console.error('Erro ao deletar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

    const updatedOrder = await orderModel.update(id, req.body);

    if (!updatedOrder) {
      return res.status(404).json({ error: 'Pedido não encontrado' });
    }

    res.status(200).json(updatedOrder);
  } catch (error) {
    console.error('Erro ao atualizar pedido:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
};

// Função auxiliar de validação
function validateOrderData(data) {
  const { numeroPedido, valorTotal, dataCriacao, items } = data;

  if (!numeroPedido || typeof numeroPedido !== 'string' || numeroPedido.trim() === '') {
    return 'numeroPedido é obrigatório e deve ser uma string não vazia';
  }
  if (valorTotal === undefined || typeof valorTotal !== 'number' || valorTotal <= 0) {
    return 'valorTotal é obrigatório e deve ser um número positivo';
  }
  if (!dataCriacao) {
    return 'dataCriacao é obrigatória';
  }
  // Validação simples de data (pode ser melhor)
  const date = new Date(dataCriacao);
  if (isNaN(date.getTime())) {
    return 'dataCriacao deve ser uma data válida (ISO 8601)';
  }
  if (!Array.isArray(items) || items.length === 0) {
    return 'items é obrigatório e deve ser um array não vazio';
  }
  for (const item of items) {
    if (!item.idItem || typeof item.idItem !== 'string' || item.idItem.trim() === '') {
      return 'Cada item deve ter idItem como string não vazia';
    }
    if (!item.quantidadeItem || typeof item.quantidadeItem !== 'number' || item.quantidadeItem <= 0 || !Number.isInteger(item.quantidadeItem)) {
      return 'Cada item deve ter quantidadeItem como número inteiro positivo';
    }
    if (!item.valorItem || typeof item.valorItem !== 'number' || item.valorItem <= 0) {
      return 'Cada item deve ter valorItem como número positivo';
    }
  }
  return null; // sem erros
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  updateOrder,
  deleteOrder
};