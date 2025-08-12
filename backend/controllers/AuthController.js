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
    const token = jwt.sign({ id: usuario.id, tipo: usuario.tipo }, JWT_SECRET, { expiresIn: '1h' });

    res.json({ mensagem: 'Login realizado com sucesso', token });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    res.status(500).json({ mensagem: 'Erro ao fazer login' });
  }
};

/* --------------------------------- LOGOUT --------------------------------- */
const logoutController = async (req, res) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: 'Nenhum usuário autenticado' });
  }

  console.log('Usuário deslogando:', req.user?.username);

  req.logout((err) => {
    if (err) {
      console.error('Erro no logout:', err);
      return res.status(500).json({ error: 'Erro ao realizar logout' });
    }

    // Destrói a sessão completamente
    req.session.destroy((destroyErr) => {
      if (destroyErr) {
        console.error('Erro ao destruir sessão:', destroyErr);
        return res.status(500).json({ error: 'Erro ao encerrar sessão' });
      }

      res.clearCookie('connect.sid'); // Remove o cookie de sessão
      res.json({ message: 'Logout realizado com sucesso' });
    });
  });
};

/* ------------------------------- CHECK-AUTH ------------------------------- */
// checa a autenticação
const checkAuthController = (req, res) => {
  if (req.isAuthenticated()) {
    return res.json({
      authenticated: true,
      user: {
        username: req.user.username,
        displayName: req.user.displayName
      }
    });
  }
  res.status(401).json({ authenticated: false });
};

export { loginController, logoutController, checkAuthController };