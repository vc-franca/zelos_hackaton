import express from 'express';
import {
    listarUsuariosController,
    obterUsuarioPorIdController,
    criarUsuarioController,
    atualizarUsuarioController,
    excluirUsuarioController
} from '../controllers/UsuariosController.js';

const router = express.Router();

router.get('/', listarUsuariosController);
router.get('/:id', obterUsuarioPorIdController);
router.post('/', criarUsuarioController);
router.put('/:id', atualizarUsuarioController);
router.delete('/:id', excluirUsuarioController);

export default router;
