// Arquivo de configuração para chaves secretas
// Em produção, estas chaves devem estar em variáveis de ambiente
import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET;
export const SESSION_SECRET = 'zelos_hackaton_session_secret_2024';
export const COOKIE_SECRET = 'zelos_hackaton_cookie_secret_2024';

// Configurações do banco de dados
export const DB_CONFIG = {
  host: 'localhost',
  user: 'root',
  password: '',
  database: 'zelos',
  port: 3306
};
