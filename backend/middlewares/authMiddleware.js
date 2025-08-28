import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta

const authMiddleware = (req, res, next) => {
  // Verificar token no header Authorization
  let token = null;
  const authHeader = req.headers.authorization;

  if (authHeader) {
    [, token] = authHeader.split(' ');
  }

  // Se não houver token no header, verificar no cookie
  if (!token && req.cookies?.token) {
    token = req.cookies.token;
  }

  if (!token) {
    return res.status(401).json({ mensagem: 'Não autorizado: Token não fornecido' });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.usuarioId = decoded.id;
    req.usuarioFuncao = decoded.funcao;
    next();
  } catch (error) {
    return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' });
  }
};

export default authMiddleware;