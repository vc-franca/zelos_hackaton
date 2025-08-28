import { listarUsers, obterUserPorId, criarUser, atualizarUser, excluirUser } from '../models/Usuarios.js';
import bcrypt from 'bcryptjs';

// import do banco de dados para verificação nas funções de criar e atualizar
import { create, readAll, read, update, deleteRecord, pool } from '../config/database.js';

/* --------------------------------- LISTAR --------------------------------- */
const listarUsuariosController = async (req, res) => {
    try {
        const usuarios = await readAll('usuarios');
        res.json(usuarios);
    } catch (err) {
        console.error('Erro ao listar usuários: ', err);
        res.status(500).json({ mensagem: 'Erro ao listar usuários', err });
    }
};

/* ------------------------------ OBTER POR ID ------------------------------ */
const obterUsuarioPorIdController = async (req, res) => {
    try {
        const usuario = await obterUserPorId(req.params.id);

        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ mensagem: 'Usuário não encontrado' });
        }

    } catch (err) {
        console.error('Erro ao obter usuário por ID: ', err);
        res.status(500).json({ mensagem: 'Erro ao obter usuário por ID: ', err });
    }
};

/* --------------------------------- CRIAR --------------------------------- */
const criarUsuarioController = async (req, res) => {
    try {
        const { nome, senha, email, funcao, estado } = req.body;

        // Gera hash automaticamente
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);

        const usuarioData = { nome, senha: hashedPassword, email, funcao, estado };
        const usuarioId = await criarUser(usuarioData);
        
        res.status(201).json({ mensagem: 'Usuário criado com sucesso: ', usuarioId });
    } catch (err) {
        console.error('Erro ao criar usuário: ', err);
        res.status(500).json({ mensagem: 'Erro ao criar usuário: ', err });
    }
};

/* -------------------------------- ATUALIZAR ------------------------------- */
const atualizarUsuarioController = async (req, res) => {
    try {
        const usuarioId = req.params.id;
        const { nome, senha, email, funcao, estado } = req.body;

        // Gera hash automaticamente
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(senha, salt);
        
        const usuarioData = { nome, senha: hashedPassword, email, funcao, estado };

        await atualizarUser(usuarioId, usuarioData);
        res.status(201).json({ mensagem: 'Usuário atualizado com sucesso' });
    } catch (err) {
        console.error('Erro ao atualizar usuário: ', err);
        res.status(500).json({ mensagem: 'Erro ao atualizar usuário: ', err });
    }
};

/* --------------------------------- EXCLUIR -------------------------------- */
const excluirUsuarioController = async (req, res) => {
    try {
        const usuarioId = req.params.id;

        // Primeiro, excluir todos os registros relacionados
        try {
            // Excluir apontamentos onde o usuário é técnico
            await pool.query('DELETE FROM apontamentos WHERE tecnico_id = ?', [usuarioId]);
            console.log(`Apontamentos relacionados ao usuário ${usuarioId} foram excluídos`);
            
            // Excluir registros de pool_tecnico
            await pool.query('DELETE FROM pool_tecnico WHERE id_tecnico = ?', [usuarioId]);
            console.log(`Registros de pool_tecnico relacionados ao usuário ${usuarioId} foram excluídos`);
            
            // Atualizar chamados onde o usuário é solicitante ou técnico
            await pool.query('UPDATE chamados SET usuario_id = NULL WHERE usuario_id = ?', [usuarioId]);
            await pool.query('UPDATE chamados SET tecnico_id = NULL WHERE tecnico_id = ?', [usuarioId]);
            console.log(`Chamados relacionados ao usuário ${usuarioId} foram atualizados`);
            
        } catch (relacionadoErr) {
            console.error('Erro ao excluir registros relacionados:', relacionadoErr);
            // Continua mesmo se houver erro ao excluir registros relacionados
        }

        // Agora excluir o usuário
        await excluirUser(usuarioId);
        res.status(200).json({ mensagem: 'Usuário excluído com sucesso' });

    } catch (err) {
        console.error('Erro ao excluir usuário: ', err);
        res.status(500).json({ mensagem: 'Erro ao excluir usuário: ', err });
    }
};

export {
    listarUsuariosController,
    obterUsuarioPorIdController,
    criarUsuarioController,
    atualizarUsuarioController,
    excluirUsuarioController
};
