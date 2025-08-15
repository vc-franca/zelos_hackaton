import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarUsers = async () => {
  try {
    return await readAll('usuarios');
  } catch (error) {
    console.error('Erro ao listar usuários:', error);
    throw error;
  }
};

const obterUserPorId = async (id) => {
  try {
    return await read('usuarios', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter usuário por ID:', error); 
    throw error;
  }
};

const criarUser= async (userData) => {
  try {
    return await create('usuarios', userData);
  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

const atualizarUser = async (id, userData) => {
  try {
    await update('usuarios', userData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

const excluirUser = async (id) => {
  try {
    await deleteRecord('usuarios', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir usuário:', error);
    throw error;
  }
};

export { listarUsers, obterUserPorId, criarUser, atualizarUser, excluirUser };