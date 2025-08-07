import { listarApontamentos, obterApontamentoPorId, criarApontamento, atualizarApontamento, excluirApontamento } from '../models/Apontamentos.js';

const listarApontamentosController = async (req, res) => {
    try {
        const apontamentos = await listarApontamentos();
        res.json(apontamentos);
    } catch (err) {
        console.error('Erro ao listar apontamentos: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar apontamentos' });
    }
};

const obterApontamentoPorIdController = async (req, res) => {
    try {
        const apontamento = await obterApontamentoPorId(req.params.id);

        if (apontamento) {
            res.json(apontamento);
        } else {
            res.status(404).json({ mensagem: 'Apontamento não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao obter apontamento por ID: ', err);
        res.status().json({ mensagem: 'Erro ao obter apontamento por ID: ' });
    }
};

const criarApontamentoController = async (req, res) => {
    try {
        const { titulo, descricao, status } = req.body;

        const apontamentoData = { titulo, descricao, status };
        const apontamentoId = await criarApontamento(apontamentoData);
        res.status(201).json({ mensagem: 'Apontamento criado com sucesso: ', apontamentoId });
    } catch (err) {
        console.error('Erro ao criar apontamento: ', err);
        res.status().json({ mensagem: 'Erro ao criar apontamento: ' });
    }
};

const atualizarApontamentoController = async (req, res) => {
    try {
        const apontamentoId = req.params.id;
        const { titulo, descricao, status } = req.body;

        const apontamentoData = { titulo, descricao, status };

        await atualizarApontamento(apontamentoId, apontamentoData);
        res.status(201).json({ mensagem: 'Apontamento atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar apontamento: ', err);
        res.status().json({ mensagem: 'Erro ao atualizar apontamento: ' });
    }
};

const excluirApontamentoController = async (req, res) => {
    try {
        const apontamentoId = req.params.id;
        await excluirApontamento(apontamentoId);
    } catch (err) {
        console.error('Erro ao excluir apontamento: ', err);
        res.status().json({ mensagem: 'Erro ao excluir apontamento: ' });
    }
};

export {
    listarApontamentosController,
    obterApontamentoPorIdController,
    criarApontamentoController,
    atualizarApontamentoController,
    excluirApontamentoController
};
