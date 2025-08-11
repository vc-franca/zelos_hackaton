import express from 'express';
import {
    listarUsuariosController,
    obterUsuarioPorIdController,
    criarUsuarioController,
    atualizarUsuarioController,
    excluirUsuarioController
} from '../controllers/UsuariosController.js';

import authMIddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', authMIddleware, listarUsuariosController);
router.get('/:id', authMIddleware, obterUsuarioPorIdController);
router.post('/', authMIddleware, criarUsuarioController);
router.put('/:id', authMIddleware, atualizarUsuarioController);
router.delete('/:id', authMIddleware, excluirUsuarioController);

export default router;
