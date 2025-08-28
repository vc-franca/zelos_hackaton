// Arquivo de configuração para chaves secretas
// Em produção, estas chaves devem estar em variáveis de ambiente

export const JWT_SECRET = 'zelos_hackaton_2024_super_secret_key_jwt_token_authentication';
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
