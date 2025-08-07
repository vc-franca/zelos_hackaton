import express from 'express';
import cors from 'cors';
import session from 'express-session';
import dotenv from 'dotenv';

/* ------------------------ // 0. Importação de rotas ----------------------- */
import authRotas from './routes/authRotas.js'; // Rotas de Autenticação

import chamadoRotas from './routes/chamadoRotas.js';
import apontamentosRotas from './routes/apontamentosRotas.js';
import poolRotas from './routes/poolRotas.js';
import poolTecnico from './routes/poolTecnicoRotas.js';
import usuariosRotas from './routes/usuariosRotas.js';


/* -------------- // 1. Carrega variáveis de ambiente PRIMEIRO -------------- */
dotenv.config();

/* ------------------ // 2. Configuração básica do Express ------------------ */
const app = express();
const porta = process.env.PORT || 8080;

/* ---------- // 3. Middlewares essenciais com tratamento de erros ---------- */
try {
  app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
  }));
  app.use(express.json());
  
  app.use(session({
    secret: 'sJYMmuCB2Z187XneUuaOVYTVUlxEOb2K94tFZy370HjOY7T7aiCKvwhNQpQBYL9e',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false }
  }));

} catch (err) {
  console.error('Erro na configuração inicial:', err);
  process.exit(1);
}

/* ------------------------------- // 5. Rotas ------------------------------ */
app.get('/', (req, res) => {
  res.status(200).send('<h1>API Zelos</h1>');
});

app.use('/auth', authRotas);
app.use('/chamados', chamadoRotas);
app.use('/apontamentos', apontamentosRotas);
app.use('/pool', poolRotas);
app.use('/poolTecnico', poolTecnico);
app.use('/usuarios', usuariosRotas);

app.get('/health', (req, res) => {
  res.status(200).json({ status: 'online' }); //não faço a mínima ideia do por que essa rota existe
});                                           // acho que é pra checar se o servidor tá online, deve ser mania de dev de complicar as coisas


/* -------------------- // 6. Tratamento de erros robusto ------------------- */
process.on('unhandledRejection', (reason, promise) => {
  console.error('Rejeição não tratada em:', promise, 'motivo:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Exceção não capturada:', err);
  process.exit(1);
});

/* ------------- // 7. Inicialização do servidor com verificação ------------ */
const server = app.listen(porta, () => {
  console.log(`Servidor rodando em: http://localhost:${porta}`);
}).on('error', (err) => {
  console.error('Erro ao iniciar:', err);
});

/* ----------------------- // 8. Encerramento elegante ---------------------- */
process.on('SIGTERM', () => {
  server.close(() => {
    console.log('Servidor encerrado');
  });
});