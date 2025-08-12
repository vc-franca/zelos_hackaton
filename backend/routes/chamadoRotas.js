/* ---------------------- ROTAS FUNCIONANDO COM SUCESSO --------------------- */

import express from 'express';
import {
    listarChamadoController,
    obterChamadoPorIdController,
    criarChamadoController,
    atualizarChamadoController,
    excluirChamadoController
} from '../controllers/ChamadosController.js';

const router = express.Router();

router.get('/', listarChamadoController);
router.get('/:id', obterChamadoPorIdController);
router.post('/', criarChamadoController);
router.put('/:id', atualizarChamadoController);
router.delete('/:id', excluirChamadoController);

export default router;