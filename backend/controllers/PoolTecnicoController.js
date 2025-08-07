import { listarPoolTecnico, obterPoolTecnicoPorId, criarPoolTecnico, atualizarPoolTecnico, excluirPoolTecnico } from '../models/PoolTecnico.js';

const listarPoolTecnicoController = async (req, res) => {
    try {
        const poolsTecnicos = await listarPoolTecnico();
        res.json(poolsTecnicos);
    } catch (err) {
        console.error('Erro ao listar pools técnicos: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar pools técnicos' });
    }
};

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
        res.status().json({ mensagem: 'Erro ao obter pool técnico por ID: ' });
    }
};

const criarPoolTecnicoController = async (req, res) => {
    try {
        const { titulo, descricao, status } = req.body;

        const poolTecnicoData = { titulo, descricao, status };
        const poolTecnicoId = await criarPoolTecnico(poolTecnicoData);
        res.status(201).json({ mensagem: 'Pool técnico criado com sucesso: ', poolTecnicoId });
    } catch (err) {
        console.error('Erro ao criar pool técnico: ', err);
        res.status().json({ mensagem: 'Erro ao criar pool técnico: ' });
    }
};

const atualizarPoolTecnicoController = async (req, res) => {
    try {
        const poolTecnicoId = req.params.id;
        const { titulo, descricao, status } = req.body;

        const poolTecnicoData = { titulo, descricao, status };

        await atualizarPoolTecnico(poolTecnicoId, poolTecnicoData);
        res.status(201).json({ mensagem: 'Pool técnico atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar pool técnico: ', err);
        res.status().json({ mensagem: 'Erro ao atualizar pool técnico: ' });
    }
};

const excluirPoolTecnicoController = async (req, res) => {
    try {
        const poolTecnicoId = req.params.id;
        await excluirPoolTecnico(poolTecnicoId);
    } catch (err) {
        console.error('Erro ao excluir pool técnico: ', err);
        res.status().json({ mensagem: 'Erro ao excluir pool técnico: ' });
    }
};

export {
    listarPoolTecnicoController,
    obterPoolTecnicoPorIdController,
    criarPoolTecnicoController,
    atualizarPoolTecnicoController,
    excluirPoolTecnicoController
};
