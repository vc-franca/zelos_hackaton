import express from 'express';
import {
  listarPoolController,
  obterPoolPorIdController,
  criarPoolController,
  atualizarPoolController,
  excluirPoolController
} from '../controllers/PoolController.js';

const router = express.Router();

router.get('/', listarPoolController);
router.get('/:id', obterPoolPorIdController);
router.post('/', criarPoolController);
router.put('/:id', atualizarPoolController);
router.delete(':id', excluirPoolController);

export default router;
