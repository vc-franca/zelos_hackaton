/* ---------------------- ROTAS FUNCIONANDO COM SUCESSO --------------------- */

import express from 'express';
import {
  listarPoolController,
  obterPoolPorIdController,
  criarPoolController,
  atualizarPoolController,
  excluirPoolController
} from '../controllers/PoolController.js';

import authMiddleware from '../middlewares/authMiddleware.js';

const router = express.Router();

router.get('/', listarPoolController);
router.get('/:id', obterPoolPorIdController);
router.post('/', authMiddleware, criarPoolController);
router.put('/:id', authMiddleware, atualizarPoolController);
router.delete('/:id', authMiddleware, excluirPoolController);

export default router;
