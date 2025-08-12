import dotenv from 'dotenv';

dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET; // chave secreta no .env
//export const JWT_SECRET = 'SUA_CHAVE_SECRETA_GERADA'; // Substitua pela sua chave secreta // já substituí, Paiva :)