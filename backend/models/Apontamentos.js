import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarApontamentos = async () => {
  try {
    return await readAll('apontamentos');
  } catch (error) {
    console.error('Erro ao listar apontamentos:', error);
    throw error;
  }
};

const obterApontamentoPorId = async (id) => {
  try {
    return await read('apontamentos', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter apontamento por ID:', error); 
    throw error;
  }
};

const criarApontamento = async (apontamentoData) => {
  try {
    return await create('apontamentos', apontamentoData);
  } catch (error) {
    console.error('Erro ao criar apontamento:', error);
    throw error;
  }
};

const atualizarApontamento = async (id, apontamentoData) => {
  try {
    await update('apontamentos', apontamentoData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar apontamento:', error);
    throw error;
  }
};

const excluirApontamento = async (id) => {
  try {
    await deleteRecord('apontamentos', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir apontamento:', error);
    throw error;
  }
};

export { listarApontamentos, obterApontamentoPorId, criarApontamento, atualizarApontamento, excluirApontamento };
