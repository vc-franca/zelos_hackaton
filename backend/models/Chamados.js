import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarChamado = async () => {
  try {
    return await readAll('chamados');
  } catch (error) {
    console.error('Erro ao listar chamados:', error);
    throw error;
  }
};

const obterChamadoPorId = async (id) => {
  try {
    return await read('chamados', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter chamados por ID:', error);
    throw error;
  }
};

const criarChamado = async (chamadoData) => {
  try {
    return await create('chamados', chamadoData);
  } catch (error) {
    console.error('Erro ao criar chamado:', error);
    throw error;
  }
};

const atualizarChamado = async (id, livroData) => {
  try {
    await update('chamados', chamadoData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar chamados:', error);
    throw error;
  }
};

const excluirChamado = async (id) => {
  try {
    await deleteRecord('chamados', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir chamados:', error);
    throw error;
  }
};

export { listarChamado, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado };