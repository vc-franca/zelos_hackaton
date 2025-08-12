import express from 'express';
import { loginController, logoutController, checkAuthController } from '../controllers/AuthController.js';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({ message: 'Rota de Autenticação' });
});

// Rota de Login
router.post('/login', loginController);

// Rota de Logout
router.post('/logout', logoutController)

// Rota para verificar autenticação
router.get('/check-auth', checkAuthController);

export default router;