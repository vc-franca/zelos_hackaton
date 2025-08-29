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
        const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND (funcao = ? OR funcao = ?)', [usuario_id, 'usuario', 'administrador']);
        const [patrimonioETipoIgual] = await pool.query('SELECT id FROM chamados WHERE patrimonio = ? AND tipo_id = ?', [patrimonio, tipo_id]);

        if (patrimonioETipoIgual) {
            return res.status(400).json({ mensagem: 'Não é possível registrar dois chamados com o mesmo número de patrimônio e tipo de serviço' });
        }

        if (!poolExiste.length) {
            return res.status(404).json({ mensagem: 'Tipo de serviço não encontrado' });
        }

        if (!usuarioExiste.length) {
            return res.status(404).json({ mensagem: 'Usuário solicitante não encontrado' });
        }

        // Verificar se técnico existe apenas se foi fornecido
        if (tecnico_id) {
            const [tecnicoExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [tecnico_id, 'tecnico']);
            if (!tecnicoExiste.length) {
                return res.status(404).json({ mensagem: 'Técnico não encontrado' });
            }
        }

        // Verificar se patrimônio tem 7 dígitos (convertendo para string)
        const patrimonioStr = String(patrimonio);
        if (patrimonioStr.length !== 7) {
            return res.status(400).json({ mensagem: 'O nº de patrimônio precisa ter 7 dígitos' });
        }
 
        const chamadoData = { titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado }

        const chamadoId = await criarChamado(chamadoData);
        res.status(201).json({ mensagem: 'Chamado criado com sucesso', id: chamadoId })
    } catch (err) {
        console.error('Erro ao criar chamado: ', err);
        res.status(500).json({ 
            mensagem: 'Erro ao criar chamado', 
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
        const [usuarioExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND (funcao = ? OR funcao = ?)', [usuario_id, 'usuario', 'administrador']);

        if (!poolExiste.length) {
            return res.status(404).json({ mensagem: 'Tipo de serviço não encontrado' });
        }

        if (!usuarioExiste.length) {
            return res.status(404).json({ mensagem: 'Usuário solicitante não encontrado' });
        }

        // Verificar se técnico existe apenas se foi fornecido
        if (tecnico_id) {
            const [tecnicoExiste] = await pool.query('SELECT id FROM usuarios WHERE id = ? AND funcao = ?', [tecnico_id, 'tecnico']);
            if (!tecnicoExiste.length) {
                return res.status(404).json({ mensagem: 'Técnico não encontrado' });
            }
        }

        // Verificar se patrimônio tem 7 dígitos (convertendo para string)
        const patrimonioStr = String(patrimonio);
        if (patrimonioStr.length !== 7) {
            return res.status(400).json({ mensagem: 'O nº de patrimônio precisa ter 7 dígitos' });
        }

        const chamadoData = { titulo, patrimonio, descricao, tipo_id, tecnico_id, usuario_id, estado }

        await atualizarChamado(chamadoId, chamadoData);
        res.status(200).json({ mensagem: 'Chamado atualizado com sucesso' });

    } catch (err) {
        console.error('Erro ao atualizar chamado: ', err);
        res.status(500).json({
            mensagem: 'Erro ao atualizar chamado',
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
        const chamadoExiste = await obterChamadoPorId(chamadoId);

        if (!chamadoExiste) {
            return res.status(404).json({ mensagem: 'Chamado não encontrado' });
        }

        // Primeiro, excluir todos os apontamentos relacionados
        try {
            await pool.query('DELETE FROM apontamentos WHERE chamado_id = ?', [chamadoId]);
            console.log(`Apontamentos relacionados ao chamado ${chamadoId} foram excluídos`);
        } catch (apontamentoErr) {
            console.error('Erro ao excluir apontamentos relacionados:', apontamentoErr);
            // Continua mesmo se houver erro ao excluir apontamentos
        }

        // Agora excluir o chamado
        await excluirChamado(chamadoId);
        res.json({ mensagem: 'Chamado excluído com sucesso' });

    } catch (err) {
        console.error('Erro ao excluir chamado: ', err);
        res.status(500).json({ mensagem: 'Erro ao excluir chamado', err });
    }
};

export {
    listarChamadoController,
    obterChamadoPorIdController,
    criarChamadoController,
    atualizarChamadoController,
    excluirChamadoController
};