import express from 'express';
import {
  listarPoolTecnicoController,
  obterPoolTecnicoPorIdController,
  criarPoolTecnicoController,
  atualizarPoolTecnicoController,
  excluirPoolTecnicoController
} from '../controllers/PoolTecnicoController.js';

const router = express.Router();

router.get('/', listarPoolTecnicoController);
router.get('/:id', obterPoolTecnicoPorIdController);
router.post('/', criarPoolTecnicoController);
router.put('/:id', atualizarPoolTecnicoController);
router.delete('/:id', excluirPoolTecnicoController);

export default router;
