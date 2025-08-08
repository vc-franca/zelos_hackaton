/* ---------------------- ROTAS FUNCIONANDO COM SUCESSO --------------------- */

import express from 'express';
import {
  listarApontamentosController,
  obterApontamentoPorIdController,
  criarApontamentoController,
  atualizarApontamentoController,
  excluirApontamentoController
} from '../controllers/ApontamentosController.js';

const router = express.Router();

router.get('/', listarApontamentosController);
router.get('/:id', obterApontamentoPorIdController);
router.post('/', criarApontamentoController);
router.put('/:id', atualizarApontamentoController);
router.delete('/:id', excluirApontamentoController);

export default router;
