📦 Order API
API RESTful para gerenciamento de pedidos e itens, desenvolvida com Node.js, Express e SQLite como parte de um processo seletivo. A aplicação permite criar, listar, atualizar e excluir pedidos, com validações e tratamento de erros adequados.

https://img.shields.io/badge/Node.js-18.17-green

https://img.shields.io/badge/Express-4.18-blue

https://img.shields.io/badge/SQLite-3-blue

https://img.shields.io/badge/license-MIT-green

🚀 Tecnologias
Node.js (v18+)

Express – framework web

SQLite + sqlite3 – banco de dados embutido

SQLite (biblioteca sqlite) – interface com promessas

CORS – middleware para controle de acesso

Dotenv – variáveis de ambiente

📋 Pré-requisitos
Node.js instalado (versão 18 ou superior)

NPM ou Yarn

Git (opcional, para clonar)

🔧 Instalação e configuração
Clone o repositório

bash
git clone https://github.com/Thaaay/order-api.git
cd order-api
Instale as dependências

bash
npm install
Configure as variáveis de ambiente (opcional)
Crie um arquivo .env na raiz com o conteúdo:

env
PORT=3000
Se não definido, a porta padrão será 3000.

Inicie o servidor

bash
npm start
Para desenvolvimento com reinicialização automática (se tiver nodemon instalado):

bash
npm run dev
Acesse a API

text
http://localhost:3000
A rota raiz retorna uma mensagem de boas-vindas e a versão.

📚 Documentação da API
Endpoints
Método	Rota	Descrição
GET	/	Mensagem de boas-vindas
GET	/health	Verificação de saúde da API
GET	/api/orders	Lista todos os pedidos
GET	/api/orders/:id	Busca um pedido por ID
POST	/api/orders	Cria um novo pedido
PUT	/api/orders/:id	Atualiza um pedido existente
DELETE	/api/orders/:id	Remove um pedido
📌 Exemplos de requisição e resposta
GET /api/orders
Retorna todos os pedidos cadastrados, com seus respectivos itens.

Resposta (200 OK)

json
[
  {
    "id": 1,
    "numeroPedido": "PEDIDO-001",
    "valorTotal": 199.99,
    "dataCriacao": "2025-03-10T14:30:00.000Z",
    "created_at": "2025-03-10 14:30:00",
    "updated_at": "2025-03-10 14:30:00",
    "items": [
      { "idItem": "ITEM001", "quantidadeItem": 2, "valorItem": 100.00 },
      { "idItem": "ITEM002", "quantidadeItem": 1, "valorItem": 99.99 }
    ]
  }
]
GET /api/orders/:id
Parâmetros de rota

id (número) – ID do pedido

Resposta (200 OK)

json
{
  "id": 1,
  "numeroPedido": "PEDIDO-001",
  "valorTotal": 199.99,
  "dataCriacao": "2025-03-10T14:30:00.000Z",
  "created_at": "2025-03-10 14:30:00",
  "updated_at": "2025-03-10 14:30:00",
  "items": [
    { "idItem": "ITEM001", "quantidadeItem": 2, "valorItem": 100.00 },
    { "idItem": "ITEM002", "quantidadeItem": 1, "valorItem": 99.99 }
  ]
}
Resposta (404 Not Found)

json
{
  "error": "Pedido não encontrado"
}
POST /api/orders
Cria um novo pedido.

Corpo da requisição (JSON)

json
{
  "numeroPedido": "PEDIDO-002",
  "valorTotal": 250.50,
  "dataCriacao": "2025-03-11T10:00:00Z",
  "items": [
    { "idItem": "ITEM003", "quantidadeItem": 1, "valorItem": 150.50 },
    { "idItem": "ITEM004", "quantidadeItem": 2, "valorItem": 50.00 }
  ]
}
Validações

Todos os campos são obrigatórios.

items deve ser um array não vazio.

Cada item deve conter idItem, quantidadeItem e valorItem.

valorTotal deve ser um número positivo.

Resposta (201 Created)

json
{
  "id": 2,
  "numeroPedido": "PEDIDO-002",
  "valorTotal": 250.50,
  "dataCriacao": "2025-03-11T10:00:00Z",
  "created_at": "2025-03-11 10:00:00",
  "updated_at": "2025-03-11 10:00:00",
  "items": [
    { "idItem": "ITEM003", "quantidadeItem": 1, "valorItem": 150.50 },
    { "idItem": "ITEM004", "quantidadeItem": 2, "valorItem": 50.00 }
  ]
}
Resposta (400 Bad Request)

json
{
  "error": "Campos obrigatórios: numeroPedido, valorTotal, dataCriacao, items (array não vazio)"
}
PUT /api/orders/:id
Atualiza um pedido existente (substitui todos os dados, inclusive itens).

Parâmetros de rota

id (número) – ID do pedido

Corpo da requisição (mesmo formato do POST)

json
{
  "numeroPedido": "PEDIDO-002-ATUALIZADO",
  "valorTotal": 300.00,
  "dataCriacao": "2025-03-11T12:00:00Z",
  "items": [
    { "idItem": "ITEM003", "quantidadeItem": 2, "valorItem": 150.00 },
    { "idItem": "ITEM005", "quantidadeItem": 1, "valorItem": 100.00 }
  ]
}
Resposta (200 OK) – retorna o pedido atualizado (igual ao GET /:id)

Resposta (404 Not Found) – se o ID não existir

Resposta (400 Bad Request) – dados inválidos

DELETE /api/orders/:id
Remove um pedido (os itens são deletados automaticamente por ON DELETE CASCADE).

Resposta (204 No Content) – sem corpo

Resposta (404 Not Found) – se o ID não existir

🗂️ Estrutura do projeto
text
order-api/
├── src/
│   ├── config/
│   │   └── database.js          # Configuração e inicialização do SQLite
│   ├── controllers/
│   │   └── orderController.js   # Controladores das rotas
│   ├── models/
│   │   └── orderModel.js        # Modelo com operações de banco
│   ├── routes/
│   │   └── orderRoutes.js       # Definição das rotas
│   └── server.js                 # Arquivo principal da aplicação
├── .gitignore                    # Arquivos ignorados pelo Git
├── package.json                  # Dependências e scripts
├── README.md                     # Documentação
└── .env.example                  # Exemplo de variáveis de ambiente
✅ Funcionalidades implementadas
CRUD completo de pedidos e itens

Transações no banco para garantir integridade (no PUT)

Validações de campos obrigatórios

Validação de valorTotal positivo

Tratamento de erros com códigos HTTP apropriados

Inicialização automática do banco de dados (tabelas criadas se não existirem)

Suporte a CORS

🔮 Melhorias futuras (sugestões)
Adicionar autenticação (JWT)

Paginação na listagem de pedidos

Filtros por data ou valor

Testes automatizados (unitários e de integração)

Validação de unicidade do numeroPedido

Formatação de data mais robusta (uso de bibliotecas como moment ou date-fns)

📄 Licença
Este projeto está licenciado sob a licença MIT – veja o arquivo LICENSE para mais detalhes.

Desenvolvido por Thaaay
Parte de um processo seletivo – 2025
