import { listarPool, obterPoolPorId, criarPool, atualizarPool, excluirPool } from '../models/Pool.js';

// import do banco de dados para verificação nas funções de criar e atualizar
import { create, readAll, read, update, deleteRecord, pool } from '../config/database.js';

/* --------------------------------- LISTAR --------------------------------- */
const listarPoolController = async (req, res) => {
    try {
        const pools = await listarPool();
        res.json(pools);
    } catch (err) {
        console.error('Erro ao listar pools: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar pools', err });
    }
};

/* ------------------------------ OBTER POR ID ------------------------------ */
const obterPoolPorIdController = async (req, res) => {
    try {
        const pool = await obterPoolPorId(req.params.id);

        if (pool) {
            res.json(pool);
        } else {
            res.status(404).json({ mensagem: 'Pool não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao obter pool por ID: ', err);
        res.status(500).json({ mensagem: 'Erro ao obter pool por ID: ', err });
    }
};

/* ---------------------------------- CRIAR --------------------------------- */
const criarPoolController = async (req, res) => {
    try {
        const { titulo, descricao, created_by, updated_by } = req.body;

        // verifica se os admins que criaram / fizeram update existem
        const [criadorExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [created_by, 'administrador']);
        const [updaterExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [updated_by, 'administrador']);

        if (!criadorExiste.length || !updaterExiste.length) {
            return res.status(404).json({ mensagem: 'Criador inexistente ou não é administrador' });
        }

        const poolData = { titulo, descricao, created_by, updated_by };
        const poolId = await criarPool(poolData);
        res.status(201).json({ mensagem: 'Pool criado com sucesso: ', poolId });
    } catch (err) {
        console.error('Erro ao criar pool: ', err);
        res.status(500).json({ mensagem: 'Erro ao criar pool: ', err });
    }
};

/* -------------------------------- ATUALIZAR ------------------------------- */
const atualizarPoolController = async (req, res) => {
    try {
        const poolId = req.params.id;
        const { titulo, descricao, created_by, updated_by } = req.body;

        // verifica se os admins que criaram / fizeram update existem
        const [criadorExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [created_by, 'administrador']);
        const [updaterExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [updated_by, 'administrador']);

        if (!criadorExiste.length || !updaterExiste.length) {
            return res.status(404).json({ mensagem: 'Criador inexistente ou não é administrador' });
        }

        const poolData = { titulo, descricao, created_by, updated_by };

        await atualizarPool(poolId, poolData);
        res.status(201).json({ mensagem: 'Pool atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar pool: ', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar pool: ', err });
    }
};

/* --------------------------------- EXCLUIR -------------------------------- */
const excluirPoolController = async (req, res) => {
    try {
        const poolId = req.params.id;

        await excluirPool(poolId);
        res.status(201).json({ mensagem: 'Pool excluído com sucesso' });

    } catch (err) {
        console.error('Erro ao excluir pool: ', err);
        res.status(500).json({ mensagem: 'Erro ao excluir pool: ', err });
    }
};

export {
    listarPoolController,
    obterPoolPorIdController,
    criarPoolController,
    atualizarPoolController,
    excluirPoolController
};
