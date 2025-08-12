/* ---------------------- ROTAS FUNCIONANDO COM SUCESSO --------------------- */

import express from 'express';
import {
  listarPoolTecnicoController,
  obterPoolTecnicoPorIdController,
  criarPoolTecnicoController,
  atualizarPoolTecnicoController,
  excluirPoolTecnicoController
} from '../controllers/PoolTecnicoController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', listarPoolTecnicoController);
router.get('/:id', obterPoolTecnicoPorIdController);
router.post('/', authMiddleware, criarPoolTecnicoController);
router.put('/:id', authMiddleware, atualizarPoolTecnicoController);
router.delete('/:id', authMiddleware, excluirPoolTecnicoController);

export default router;
