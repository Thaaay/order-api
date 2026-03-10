const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const orderRoutes = require('./routes/orderRoutes');
const { initializeDatabase } = require('./config/database');

// Carrega variáveis de ambiente
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'development';

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rotas públicas
app.get('/', (req, res) => {
  res.json({
    message: 'API de Pedidos',
    version: '1.0.0',
    environment: NODE_ENV
  });
});

app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: process.uptime()
  });
});

// Rotas da API
app.use('/api/orders', orderRoutes);

// Middleware para rotas não encontradas (404)
app.use((req, res) => {
  res.status(404).json({
    error: 'Rota não encontrada',
    message: `A rota ${req.method} ${req.originalUrl} não existe`
  });
});

// Inicializa o banco de dados e inicia o servidor
initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT} (${NODE_ENV})`);
      console.log(`Banco de dados SQLite inicializado`);
    });
  })
  .catch(err => {
    console.error('Falha ao inicializar o banco de dados:', err.message);
    process.exit(1);
  });