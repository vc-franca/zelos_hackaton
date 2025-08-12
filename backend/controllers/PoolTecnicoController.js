import { listarPoolTecnico, obterPoolTecnicoPorId, criarPoolTecnico, atualizarPoolTecnico, excluirPoolTecnico } from '../models/PoolTecnico.js';

// import do banco de dados para verificação nas funções de criar e atualizar
import { create, readAll, read, update, deleteRecord, pool } from '../config/database.js';

/* --------------------------------- LISTAR --------------------------------- */
const listarPoolTecnicoController = async (req, res) => {
    try {
        const poolsTecnicos = await listarPoolTecnico();
        res.json(poolsTecnicos);
    } catch (err) {
        console.error('Erro ao listar pools técnicos: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar pools técnicos', err });
    }
};

/* ------------------------------ OBTER POR ID ------------------------------ */
const obterPoolTecnicoPorIdController = async (req, res) => {
    try {
        const poolTecnico = await obterPoolTecnicoPorId(req.params.id);

        if (poolTecnico) {
            res.json(poolTecnico);
        } else {
            res.status(404).json({ mensagem: 'Pool técnico não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao obter pool técnico por ID: ', err);
        res.status(500).json({ mensagem: 'Erro ao obter pool técnico por ID: ', err });
    }
};

/* ---------------------------------- CRIAR --------------------------------- */
const criarPoolTecnicoController = async (req, res) => {
    try {
        const { id_pool, id_tecnico } = req.body;

        // verifica se o usuário mencionado é um técnico ou se pool existe
        const [isTecnico] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [id_tecnico, 'tecnico']);
        const [poolExiste] = await pool.query('SELECT id FROM pool WHERE id = ?', [id_pool]);

        if (!isTecnico.length) {
            return res.status(404).json({ mensagem: 'Usuário inexistente ou não é técnico' });
        }

        if (!poolExiste.length) {
            return res.status(404).json({ mensagem: 'Pool inexistente' });
        }

        const poolTecnicoData = { id_pool, id_tecnico };
        const poolTecnicoId = await criarPoolTecnico(poolTecnicoData);
        res.status(201).json({ mensagem: 'Pool técnico criado com sucesso: ', poolTecnicoId });
    } catch (err) {
        console.error('Erro ao criar pool técnico: ', err);
        res.status(500).json({ mensagem: 'Erro ao criar pool técnico: ', err });
    }
};

/* -------------------------------- ATUALIZAR ------------------------------- */
const atualizarPoolTecnicoController = async (req, res) => {
    try {
        const poolTecnicoId = req.params.id;
        const { id_pool, id_tecnico } = req.body;

        // verifica se o usuário mencionado é um técnico ou se pool existe
        const [isTecnico] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [id_tecnico, 'tecnico']);
        const [poolExiste] = await pool.query('SELECT id FROM pool WHERE id = ?', [id_pool]);

        if (!isTecnico.length) {
            return res.status(404).json({ mensagem: 'Usuário inexistente ou não é técnico' });
        }

        if (!poolExiste.length) {
            return res.status(404).json({ mensagem: 'Pool inexistente' });
        }

        const poolTecnicoData = { id_pool, id_tecnico };

        await atualizarPoolTecnico(poolTecnicoId, poolTecnicoData);
        res.status(201).json({ mensagem: 'Pool técnico atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar pool técnico: ', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar pool técnico: ', err });
    }
};

/* --------------------------------- EXCLUIR -------------------------------- */
const excluirPoolTecnicoController = async (req, res) => {
    try {
        const poolTecnicoId = req.params.id;

        await excluirPoolTecnico(poolTecnicoId);
        res.status(201).json({ mensagem: 'Pool técnico excluído com sucesso' });

    } catch (err) {
        console.error('Erro ao excluir pool técnico: ', err);
        res.status(500).json({ mensagem: 'Erro ao excluir pool técnico: ', err });
    }
};

export {
    listarPoolTecnicoController,
    obterPoolTecnicoPorIdController,
    criarPoolTecnicoController,
    atualizarPoolTecnicoController,
    excluirPoolTecnicoController
};
