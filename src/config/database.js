const sqlite3 = require('sqlite3');
const { open } = require('sqlite');
const path = require('path');
const fs = require('fs');

// Garantir que a pasta existe
const dbDir = path.join(__dirname, '../database');
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

const dbPath = path.join(dbDir, 'database.sqlite');

let db = null;

async function initializeDatabase() {
  if (db) return db;

  try {
    db = await open({
      filename: dbPath,
      driver: sqlite3.Database
    });

    // Habilitar suporte a chaves estrangeiras (necessário para ON DELETE CASCADE)
    await db.exec('PRAGMA foreign_keys = ON');

    // Criar tabelas
    await db.exec(`
      CREATE TABLE IF NOT EXISTS orders (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        numeroPedido TEXT NOT NULL,
        valorTotal REAL NOT NULL,
        dataCriacao TEXT NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS order_items (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        order_id INTEGER NOT NULL,
        idItem TEXT NOT NULL,
        quantidadeItem INTEGER NOT NULL,
        valorItem REAL NOT NULL,
        FOREIGN KEY (order_id) REFERENCES orders(id) ON DELETE CASCADE
      );
    `);

    console.log(`Banco de dados SQLite inicializado em: ${dbPath}`);
    return db;
  } catch (error) {
    console.error('Erro ao inicializar banco de dados:', error);
    throw error;
  }
}

module.exports = {
  initializeDatabase,
  getDb: () => db
};