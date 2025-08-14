import { listarChamado, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado } from '../models/Chamados.js';

// import do banco de dados para verificação nas funções de criar e atualizar
import { create, readAll, read, update, deleteRecord, pool } from '../config/database.js';

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
        const { titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado } = req.body;

        // verificações necessárias
        const [poolExiste] = await pool.query('SELECT id FROM pool WHERE id = ?', [tipo_id]);
        const [tecnicoExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [tecnico_id, 'tecnico']);
        const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [usuario_id, 'usuario']);

        if (!poolExiste.length || !tecnicoExiste.length || !usuarioExiste.length) {
            return res.status(404).json({ mensagem: 'Tipo, técnico ou usuário não encontrados' });
        }

        if (patrimonio.length !== 7) {
            return res.status(400).json({ mensagem: 'O nº de patrimônio precisa ter 7 dígitos' });
        }
 
        const chamadoData = { titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado }

        const chamadoId = await criarChamado(chamadoData);
        res.status(201).json({ mensagem: 'Chamado criado com sucesso: ', chamadoId })
    } catch (err) {
        console.error('Erro ao criar chamado por ID: ', err);
        res.status(500).json({ 
            mensagem: 'Erro ao criar chamado por ID: ', 
            err: {
                message: err.message,
                stack: err.stack,
            }
         });
    }
};


/* -------------------------------- ATUALIZAR ------------------------------- */
const atualizarChamadoController = async (req, res) => {
    try {
        const chamadoId = req.params.id
        const { titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado } = req.body;

        // verificações necessárias
        const [poolExiste] = await pool.query('SELECT id FROM pool WHERE id = ?', [tipo_id]);
        const [tecnicoExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [tecnico_id, 'tecnico']);
        const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [usuario_id, 'usuario']);

        if (!poolExiste.length || !tecnicoExiste.length || !usuarioExiste.length) {
            return res.status(404).json({ mensagem: 'Tipo, técnico ou usuário não encontrados' });
        }

        if (patrimonio.length !== 7) {
            return res.status(400).json({ mensagem: 'O nº de patrimônio precisa ter 7 dígitos' });
        }

        const chamadoData = { titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado }

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