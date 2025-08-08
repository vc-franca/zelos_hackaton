import { listarPool, obterPoolPorId, criarPool, atualizarPool, excluirPool } from '../models/Pool.js';

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
        const { titulo, descricao, status } = req.body;

        const poolData = { titulo, descricao, status };
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
        const { titulo, descricao, status } = req.body;

        const poolData = { titulo, descricao, status };

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
