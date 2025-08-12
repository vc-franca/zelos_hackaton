import { listarApontamentos, obterApontamentoPorId, criarApontamento, atualizarApontamento, excluirApontamento } from '../models/Apontamentos.js';

// import do banco de dados para verificação nas funções de criar e atualizar
import { create, readAll, read, update, deleteRecord, pool } from '../config/database.js';

/* --------------------------------- LISTAR --------------------------------- */
const listarApontamentosController = async (req, res) => {
    try {
        const apontamentos = await listarApontamentos();
        res.json(apontamentos);
    } catch (err) {
        console.error('Erro ao listar apontamentos: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar apontamentos', err });
    }
};

/* ------------------------------ OBTER POR ID ------------------------------ */
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
        res.status(500).json({ mensagem: 'Erro ao obter apontamento por ID: ', err });
    }
};

/* ---------------------------------- CRIAR --------------------------------- */
const criarApontamentoController = async (req, res) => {
    try {
        const { chamado_id, tecnico_id, descricao, comeco, fim } = req.body;

        // verifica se chamado e técnico existem
        const [chamadoExiste] = await pool.query('SELECT id FROM chamados WHERE id = ?', [chamado_id]);
        const [tecnicoExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [tecnico_id, 'tecnico']);

        if (!chamadoExiste.length || !tecnicoExiste.length) {
            return res.status(404).json({ mensagem: 'Chamado ou técnico não encontrados' });
        }

        const apontamentoData = { chamado_id, tecnico_id, descricao, comeco, fim };
        const apontamentoId = await criarApontamento(apontamentoData);
        res.status(201).json({ mensagem: 'Apontamento criado com sucesso: ', apontamentoId });
    } catch (err) {
        console.error('Erro ao criar apontamento: ', err);
        res.status(500).json({
            mensagem: 'Erro ao criar apontamento: ',
            err: {
                message: err.message,
                stack: err.stack,
            }
        });
    }
};

/* -------------------------------- ATUALIZAR ------------------------------- */
const atualizarApontamentoController = async (req, res) => {
    try {
        const apontamentoId = req.params.id;
        const { chamado_id, tecnico_id, descricao, comeco, fim } = req.body;

        // verifica se chamado e técnico existem
        const [chamadoExiste] = await pool.query('SELECT id FROM chamados WHERE id = ?', [chamado_id]);
        const [tecnicoExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [tecnico_id, 'tecnico']);

        if (!chamadoExiste.length || !tecnicoExiste.length) {
            return res.status(404).json({ mensagem: 'Chamado ou técnico não encontrados' });
        }

        const apontamentoData = { chamado_id, tecnico_id, descricao, comeco, fim };

        await atualizarApontamento(apontamentoId, apontamentoData);
        res.status(201).json({ mensagem: 'Apontamento atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar apontamento: ', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar apontamento: ', err });
    }
};

/* --------------------------------- EXCLUIR -------------------------------- */
const excluirApontamentoController = async (req, res) => {
    try {
        const apontamentoId = req.params.id;

        await excluirApontamento(apontamentoId);
        res.status(201).json({ mensagem: 'Apontamento excluído com sucesso' });
    } catch (err) {
        console.error('Erro ao excluir apontamento: ', err);
        res.status(500).json({ mensagem: 'Erro ao excluir apontamento: ', err });
    }
};

export {
    listarApontamentosController,
    obterApontamentoPorIdController,
    criarApontamentoController,
    atualizarApontamentoController,
    excluirApontamentoController
};
