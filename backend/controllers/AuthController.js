import jwt from 'jsonwebtoken';
import { read, compare } from '../config/database.js';
import { JWT_SECRET } from '../config/jwt.js'; // Importar a chave secreta


/* ---------------------------------- LOGIN --------------------------------- */
const loginController = async (req, res) => {
  const { email, senha } = req.body;

  try {
    // Verificar se o usuário existe no banco de dados
    const usuario = await read('usuarios', `email = '${email}'`);

    if (!usuario) {
      return res.status(404).json({ mensagem: 'Usuário não encontrado' });
    }

    // Verificar se a senha está correta (comparar a senha enviada com o hash armazenado)
    const senhaCorreta = await compare(senha, usuario.senha);

    if (!senhaCorreta) {
      return res.status(401).json({ mensagem: 'Senha incorreta' });
    }

    // Gerar o token JWT
    const token = jwt.sign({ id: usuario.id, funcao: usuario.funcao }, JWT_SECRET, { expiresIn: '1h' });

    // 4. Salva no cookie (HTTP-only)
    res.cookie('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 3600000,
    });

    res.status(200).json({
      mensagem: 'Login realizado com sucesso',
      user: {
        id: usuario.id,
        funcao: usuario.funcao,
        email: usuario.email,
      }
    });

  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login', error });
  }
};

/* --------------------------------- LOGOUT --------------------------------- */
const logoutController = (req, res) => {
  // Remove o cookie onde o token foi armazenado
  res.clearCookie('token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict'
  });

  return res.json({ mensagem: 'Logout realizado com sucesso' });
};

/* ------------------------------- CHECK-AUTH ------------------------------- */
// checa a autenticação
const checkAuthController = (req, res) => {
  const token = req.cookies?.token; // pega o cookie chamado "token"

  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    // verifica e decodifica o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    return res.json({
      authenticated: true,
      user: {
        id: decoded.id,
        funcao: decoded.funcao
      }
    });
  } catch (err) {
    return res.status(401).json({ authenticated: false, error: 'Token inválido ou expirado' });
  }
};

export { loginController, logoutController, checkAuthController };