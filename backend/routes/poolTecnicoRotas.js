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
import { pool } from '../config/database.js';

const router = express.Router();

router.get('/', listarPoolTecnicoController);
router.get('/:id', obterPoolTecnicoPorIdController);

// Nova rota para buscar técnicos por tipo
router.get('/tecnicos/:tipoId', async (req, res) => {
  try {
    const { tipoId } = req.params;
    
    const [tecnicos] = await pool.query(`
      SELECT u.id, u.nome 
      FROM usuarios u 
      INNER JOIN pool_tecnico pt ON u.id = pt.id_tecnico 
      WHERE pt.id_pool = ? AND u.funcao = 'tecnico' AND u.estado = 'ativo'
    `, [tipoId]);
    
    res.json(tecnicos);
  } catch (error) {
    console.error('Erro ao buscar técnicos por tipo:', error);
    res.status(500).json({ mensagem: 'Erro ao buscar técnicos' });
  }
});

router.post('/', authMiddleware, criarPoolTecnicoController);
router.put('/:id', authMiddleware, atualizarPoolTecnicoController);
router.delete('/:id', authMiddleware, excluirPoolTecnicoController);

export default router;