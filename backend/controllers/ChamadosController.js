import { listarChamado, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado } from '../models/Chamados.js';

/* --------------------------------- LISTAR --------------------------------- */
const listarChamadoController = async (req, res) => {
    try {
        const chamados = await listarChamado();
        res.json(chamados);
    } catch (err) {
        console.error('Erro ao listar chamados: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar chamados', err });
    }
};


/* ------------------------------ OBTER POR ID ------------------------------ */
const obterChamadoPorIdController = async (req, res) => {
    try {
        const chamado = await obterChamadoPorId(req.params.id);

        if (chamado) {
            res.json(chamado);
        } else {
            res.status(404).json({ mensagem: 'Chamado não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao obter chamado por ID: ', err);
        res.status(500).json({ mensagem: 'Erro ao obter chamado por ID: ', err });
    }
};


/* ---------------------------------- CRIAR --------------------------------- */
const criarChamadoController = async (req, res) => {
    try {
        const { titulo, descricao, estado } = req.body;

        const chamadoData = {
            titulo: titulo,
            descricao: descricao,
            estado: estado,
        }

        const chamadoId = await criarChamado(chamadoData);
        res.status(201).json({ mensagem: 'Chamado criado com sucesso: ', chamadoId })
    } catch (err) {
        console.error('Erro ao criar chamado por ID: ', err);
        res.status(500).json({ mensagem: 'Erro ao criar chamado por ID: ', err });
    }
};


/* -------------------------------- ATUALIZAR ------------------------------- */
const atualizarChamadoController = async (req, res) => {
    try {
        const chamadoId = req.params.id
        const { titulo, descricao, estado } = req.body;

        const chamadoData = {
            titulo: titulo,
            descricao: descricao,
            estado: estado,
        }

        await atualizarChamado(chamadoId, chamadoData);
        res.status(201).json({ mensagem: 'Chamado atualizado com sucesso' });

    } catch (err) {
        console.error('Erro ao atualizar chamado: ', err);
        res.status(500).json({ 
            mensagem: 'Erro ao atualizar chamado por ID: ',
            err: {
                message: err.message,
                stack: err.stack,
            }
        });
    }
};


/* --------------------------------- EXCLUIR -------------------------------- */
const excluirChamadoController = async (req, res) => {
    try {
        const chamadoId = req.params.id;

        await excluirChamado(chamadoId);
        res.status(201).json({ mensagem: 'Chamado excluído com sucesso' });

    } catch (err) {
        console.error('Erro ao excluir chamado por ID: ', err);
        res.status(500).json({ mensagem: 'Erro ao excluir chamado por ID: ', err });
    }
};

export { listarChamadoController, obterChamadoPorIdController, criarChamadoController, atualizarChamadoController, excluirChamadoController };