// ============================================================
//  🎓 SERVER PRINCIPAL — API REST para Aulas Didáticas
//  Conceitos cobertos:
//    - CORS (habilitado e bloqueado)
//    - Autenticação com Bearer Token (JWT)
//    - Erros HTTP: 400, 401, 403, 404, 500
//    - Params via URL  (/users/:id)
//    - Params via Query String (?name=valor)
//    - Payload via Body (JSON)
//    - CRUD completo de usuários
// ============================================================

const express = require("express");
const cors = require("cors");
const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const PORT = 3002; // 👈 Sempre rodar na 3002 para não conflitar!
const JWT_SECRET = "segredo_super_secreto_para_aula"; // Em produção nunca hardcode!

// Configura o servidor HTTP com Express e Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*", // 🎓 Para aula, liberamos geral. Em produção, coloque o domínio exato.
    methods: ["GET", "POST"]
  }
});

// ============================================================
//  MIDDLEWARE GLOBAL
// ============================================================
app.use(express.json()); // Parseia body JSON

// ============================================================
//  BANCO DE DADOS "FAKE" em memória (simula um banco real)
// ============================================================
let users = [
  {
    id: "1",
    name: "Ana Silva",
    email: "ana@email.com",
    password: bcrypt.hashSync("123456", 8),
    role: "admin",
    age: 25,
    city: "São Paulo",
  },
  {
    id: "2",
    name: "Bruno Costa",
    email: "bruno@email.com",
    password: bcrypt.hashSync("123456", 8),
    role: "user",
    age: 30,
    city: "Rio de Janeiro",
  },
  {
    id: "3",
    name: "Carla Mendes",
    email: "carla@email.com",
    password: bcrypt.hashSync("123456", 8),
    role: "user",
    age: 22,
    city: "Curitiba",
  },
];

// ============================================================
//  MIDDLEWARE DE AUTENTICAÇÃO (verifica Bearer Token)
// ============================================================
function authMiddleware(req, res, next) {
  const authHeader = req.headers["authorization"];

  // Verifica se o header Authorization existe
  if (!authHeader) {
    return res.status(401).json({
      error: "Não autorizado",
      message: "Token não fornecido. Envie no header: Authorization: Bearer <token>",
      code: "TOKEN_MISSING",
    });
  }

  // O header deve ser no formato "Bearer <token>"
  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({
      error: "Formato inválido",
      message: "Use o formato: Authorization: Bearer <token>",
      code: "TOKEN_BAD_FORMAT",
    });
  }

  const token = parts[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Coloca os dados do usuário na requisição
    next();
  } catch (err) {
    return res.status(401).json({
      error: "Token inválido ou expirado",
      message: err.message,
      code: "TOKEN_INVALID",
    });
  }
}

// Middleware de verificação de role (somente admin)
function adminMiddleware(req, res, next) {
  if (req.user.role !== "admin") {
    return res.status(403).json({
      error: "Acesso proibido",
      message: "Você não tem permissão de admin para acessar este recurso.",
      code: "FORBIDDEN",
    });
  }
  next();
}

// ============================================================
//  ROTA DE HEALTH CHECK (sempre pública)
// ============================================================
app.get("/", (req, res) => {
  res.json({
    message: "🎓 API Didática funcionando!",
    version: "1.0.0",
    endpoints: {
      auth: ["POST /auth/login", "POST /auth/register"],
      users: [
        "GET /users (protegido)",
        "GET /users/:id (protegido)",
        "POST /users (protegido, admin)",
        "PUT /users/:id (protegido, admin)",
        "DELETE /users/:id (protegido, admin)",
      ],
      exemplos: [
        "GET /exemplos/query-params?nome=x&cidade=y",
        "POST /exemplos/body-payload",
        "GET /exemplos/erro-500",
        "GET /exemplos/erro-404",
        "GET /exemplos/erro-400",
        "GET /exemplos/sem-cors (vai dar erro de CORS!)",
        "GET /exemplos/com-cors-liberado",
      ],
    },
  });
});

// ============================================================
//  ROTAS DE AUTENTICAÇÃO
// ============================================================

// POST /auth/login
// Body: { email, password }
// Retorna: Bearer Token JWT
app.post("/auth/login", cors(), (req, res) => {
  const { email, password } = req.body;

  // 🎓 Exemplo de validação (erro 400)
  if (!email || !password) {
    return res.status(400).json({
      error: "Dados inválidos",
      message: "Email e senha são obrigatórios",
      fields: {
        email: !email ? "Email é obrigatório" : null,
        password: !password ? "Senha é obrigatória" : null,
      },
      code: "VALIDATION_ERROR",
    });
  }

  const user = users.find((u) => u.email === email);

  // 🎓 Usuário não encontrado (401)
  if (!user) {
    return res.status(401).json({
      error: "Credenciais inválidas",
      message: "Email ou senha incorretos",
      code: "INVALID_CREDENTIALS",
    });
  }

  const passwordMatch = bcrypt.compareSync(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({
      error: "Credenciais inválidas",
      message: "Email ou senha incorretos",
      code: "INVALID_CREDENTIALS",
    });
  }

  // Gera o token JWT com validade de 1 hora
  const token = jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: "1h" }
  );

  return res.status(200).json({
    message: "Login realizado com sucesso!",
    token,
    user: { id: user.id, name: user.name, email: user.email, role: user.role },
  });
});

// POST /auth/register
// Body: { name, email, password, age, city }
app.post("/auth/register", cors(), (req, res) => {
  const { name, email, password, age, city } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Dados incompletos",
      message: "Nome, email e senha são obrigatórios",
      code: "VALIDATION_ERROR",
    });
  }

  const exists = users.find((u) => u.email === email);
  if (exists) {
    return res.status(400).json({
      error: "Email já cadastrado",
      message: "Já existe um usuário com esse email",
      code: "EMAIL_DUPLICATE",
    });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: bcrypt.hashSync(password, 8),
    role: "user",
    age: age || null,
    city: city || null,
  };

  users.push(newUser);

  return res.status(201).json({
    message: "Usuário criado com sucesso!",
    user: { id: newUser.id, name: newUser.name, email: newUser.email, role: newUser.role },
  });
});

// ============================================================
//  CRUD DE USUÁRIOS (todos protegidos por Bearer Token)
// ============================================================

// 🎓 GET /users — Lista todos os usuários
// CORS: liberado, Autenticação: obrigatória
app.get("/users", cors(), authMiddleware, (req, res) => {
  const safeUsers = users.map(({ password, ...u }) => u); // Remove senha da resposta
  res.status(200).json({
    message: "Usuários listados com sucesso",
    total: safeUsers.length,
    data: safeUsers,
  });
});

// 🎓 GET /users/:id — Busca usuário por ID (Param de URL)
// Demonstra: params de rota, 404 quando não encontra
app.get("/users/:id", cors(), authMiddleware, (req, res) => {
  const { id } = req.params; // 🎓 Pega o :id da URL

  const user = users.find((u) => u.id === id);
  if (!user) {
    return res.status(404).json({
      error: "Não encontrado",
      message: `Usuário com id '${id}' não foi encontrado`,
      code: "NOT_FOUND",
    });
  }

  const { password, ...safeUser } = user;
  res.status(200).json({ message: "Usuário encontrado", data: safeUser });
});

// 🎓 POST /users — Cria novo usuário (admin only)
// Demonstra: body payload, validação, 403 de permissão
app.post("/users", cors(), authMiddleware, adminMiddleware, (req, res) => {
  const { name, email, password, age, city, role } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({
      error: "Dados inválidos",
      message: "name, email e password são obrigatórios no body",
      code: "VALIDATION_ERROR",
    });
  }

  const newUser = {
    id: uuidv4(),
    name,
    email,
    password: bcrypt.hashSync(password, 8),
    role: role || "user",
    age: age || null,
    city: city || null,
  };

  users.push(newUser);
  const { password: _, ...safeUser } = newUser;

  res.status(201).json({ message: "Usuário criado!", data: safeUser });
});

// 🎓 PUT /users/:id — Atualiza usuário
// Demonstra: param de rota + body juntos
app.put("/users/:id", cors(), authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  const index = users.findIndex((u) => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: "Usuário não encontrado", code: "NOT_FOUND" });
  }

  if (updates.password) {
    updates.password = bcrypt.hashSync(updates.password, 8);
  }

  users[index] = { ...users[index], ...updates };
  const { password, ...safeUser } = users[index];

  res.status(200).json({ message: "Usuário atualizado!", data: safeUser });
});

// 🎓 DELETE /users/:id — Deleta usuário
app.delete("/users/:id", cors(), authMiddleware, adminMiddleware, (req, res) => {
  const { id } = req.params;
  const index = users.findIndex((u) => u.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Usuário não encontrado", code: "NOT_FOUND" });
  }

  const deleted = users.splice(index, 1)[0];
  const { password, ...safeUser } = deleted;

  res.status(200).json({ message: "Usuário deletado com sucesso!", data: safeUser });
});

// ============================================================
//  ENDPOINTS DIDÁTICOS — exemplos de erros e params
// ============================================================

// 🎓 QUERY PARAMS — Filtro via ?nome=x&cidade=y
// URL: GET /exemplos/query-params?nome=Ana&cidade=São Paulo
app.get("/exemplos/query-params", cors(), (req, res) => {
  const { nome, cidade, minAge, maxAge } = req.query; // 🎓 req.query pega os ?params

  let resultado = users.map(({ password, ...u }) => u);

  if (nome) resultado = resultado.filter((u) => u.name.toLowerCase().includes(nome.toLowerCase()));
  if (cidade) resultado = resultado.filter((u) => u.city?.toLowerCase().includes(cidade.toLowerCase()));
  if (minAge) resultado = resultado.filter((u) => u.age >= parseInt(minAge));
  if (maxAge) resultado = resultado.filter((u) => u.age <= parseInt(maxAge));

  res.json({
    message: "Filtro por query params aplicado",
    filtrosAplicados: { nome, cidade, minAge, maxAge },
    total: resultado.length,
    data: resultado,
  });
});

// 🎓 BODY PAYLOAD — Recebe dados no corpo da requisição
// POST /exemplos/body-payload
// Body: { mensagem, dados }
app.post("/exemplos/body-payload", cors(), (req, res) => {
  const body = req.body; // 🎓 req.body contém o JSON enviado

  if (!body || Object.keys(body).length === 0) {
    return res.status(400).json({
      error: "Body vazio",
      message: "Envie um JSON no corpo da requisição",
      exemplo: { mensagem: "Olá", dados: { qualquer: "coisa" } },
    });
  }

  res.json({
    message: "Body recebido com sucesso!",
    voceEnviou: body,
    timestamp: new Date().toISOString(),
  });
});

// 🎓 ERRO 500 — Simula um erro interno do servidor
app.get("/exemplos/erro-500", cors(), (req, res) => {
  try {
    throw new Error("Algo explodiu no servidor! (simulado para aula)");
  } catch (err) {
    return res.status(500).json({
      error: "Erro interno do servidor",
      message: err.message,
      code: "INTERNAL_SERVER_ERROR",
      dica: "Status 500 = problema no servidor, não no cliente",
    });
  }
});

// 🎓 ERRO 404 — Recurso não encontrado
app.get("/exemplos/erro-404", cors(), (req, res) => {
  return res.status(404).json({
    error: "Não encontrado",
    message: "O recurso solicitado não existe",
    code: "NOT_FOUND",
    dica: "Status 404 = URL existe mas o RECURSO não foi encontrado",
  });
});

// 🎓 ERRO 400 — Bad Request (dados inválidos)
app.get("/exemplos/erro-400", cors(), (req, res) => {
  return res.status(400).json({
    error: "Requisição inválida",
    message: "Os dados enviados são inválidos ou estão faltando",
    code: "BAD_REQUEST",
    dica: "Status 400 = O CLIENTE enviou dados errados",
    camposObrigatorios: ["nome", "email"],
  });
});

// 🎓 ERRO DE CORS — Esta rota NÃO tem cors() configurado
// O browser vai bloquear, mas Postman/curl funcionam!
app.get("/exemplos/sem-cors", (req, res) => {
  // SEM cors() aqui! 
  res.json({
    message: "Esta resposta chegou no servidor, mas o browser bloqueou!",
    explicacao: "O servidor respondeu OK (200), mas sem o header 'Access-Control-Allow-Origin', o browser rejeita.",
    dica: "No Postman vai funcionar porque Postman não tem política de CORS",
  });
});

// 🎓 COM CORS liberado — para comparar
app.get("/exemplos/com-cors-liberado", cors(), (req, res) => {
  res.json({
    message: "Esta rota tem CORS liberado! O browser aceita.",
    headers: "O servidor envia: Access-Control-Allow-Origin: *",
  });
});

// 🎓 ENDPOINT que exige autenticação mas gera erro 401
app.get("/exemplos/precisa-de-token", cors(), authMiddleware, (req, res) => {
  res.json({
    message: "Parabéns! Você estava autenticado!",
    seuUsuario: req.user,
  });
});

// 🎓 ENDPOINT que exige role ADMIN (gera 403 para users normais)
app.get("/exemplos/somente-admin", cors(), authMiddleware, adminMiddleware, (req, res) => {
  res.json({
    message: "Área restrita de ADMIN!",
    usuariosNoSistema: users.length,
  });
});

// ============================================================
//  HANDLER GLOBAL DE ERROS (middleware de erro do Express)
// ============================================================
app.use((err, req, res, next) => {
  console.error("💥 Erro não tratado:", err);
  res.status(500).json({
    error: "Erro interno inesperado",
    message: err.message,
    code: "UNHANDLED_ERROR",
  });
});

// 🎓 Rota "catch-all" — retorna 404 para qualquer rota inexistente
app.use("*", cors(), (req, res) => {
  res.status(404).json({
    error: "Rota não encontrada",
    message: `A rota '${req.originalUrl}' não existe nesta API`,
    code: "ROUTE_NOT_FOUND",
  });
});

// ============================================================
//  WEBSOCKETS (Socket.io)
// ============================================================
io.on("connection", (socket) => {
  console.log(`🔌 Novo cliente conectado! ID: ${socket.id}`);

  // Ouve um evento chamado 'mensagem_cliente'
  socket.on("mensagem_cliente", (data) => {
    console.log(`Mensagem recebida do cliente ${socket.id}:`, data);

    // Responde apenas para quem enviou
    socket.emit("resposta_servidor", {
      mensagem: `Olá! Servidor recebeu sua mensagem: "${data.mensagem}"`,
      timestamp: new Date().toISOString()
    });

    // Emite para TODOS os clientes conectados (broadcast)
    io.emit("aviso_geral", {
      mensagem: `O cliente ${socket.id.substring(0, 5)}... acabou de enviar uma mensagem.`,
      timestamp: new Date().toISOString()
    });
  });

  socket.on("disconnect", () => {
    console.log(`❌ Cliente desconectado! ID: ${socket.id}`);
  });
});

// ============================================================
//  INICIA O SERVIDOR
// ============================================================
server.listen(PORT, () => {
  console.log(`
  ╔══════════════════════════════════════════╗
  ║   🎓 API Didática rodando na porta ${PORT}  ║
  ║   http://localhost:${PORT}                  ║
  ║   🔌 WebSockets Ativados                 ║
  ╚══════════════════════════════════════════╝
  
  Credenciais de teste:
  📧 Email: ana@email.com (ADMIN)
  🔑 Senha: 123456
  
  📧 Email: bruno@email.com (USER)
  🔑 Senha: 123456
  `);
});
