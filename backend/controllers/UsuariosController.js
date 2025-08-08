import { listarUsers, obterUserPorId, criarUser, atualizarUser, excluirUser } from '../models/Usuarios.js';

/* --------------------------------- LISTAR --------------------------------- */
const listarUsuariosController = async (req, res) => {
    try {
        const usuarios = await listarUsers();
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
        const { titulo, descricao, status } = req.body;

        const usuarioData = { titulo, descricao, status };
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
        const { titulo, descricao, status } = req.body;

        const usuarioData = { titulo, descricao, status };

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

        await excluirUser(usuarioId);
        res.status(201).json({ mensagem: 'Usuário excluído com sucesso' });

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
