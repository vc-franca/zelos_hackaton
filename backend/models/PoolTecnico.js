import { create, readAll, read, update, deleteRecord } from '../config/database.js';

const listarPoolTecnico = async () => {
  try {
    return await readAll('pool_tecnico');
  } catch (error) {
    console.error('Erro ao listar pool_tecnico:', error);
    throw error;
  }
};

const obterPoolTecnicoPorId = async (id) => {
  try {
    return await read('pool_tecnico', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao obter pool_tecnico por ID:', error); 
    throw error;
  }
};

const criarPoolTecnico = async (poolTecnicoData) => {
  try {
    return await create('pool_tecnico', poolTecnicoData);
  } catch (error) {
    console.error('Erro ao criar pool_tecnico:', error);
    throw error;
  }
};

const atualizarPoolTecnico = async (id, poolTecnicoData) => {
  try {
    await update('pool_tecnico', poolTecnicoData, `id = ${id}`);
  } catch (error) {
    console.error('Erro ao atualizar pool_tecnico:', error);
    throw error;
  }
};

const excluirPoolTecnico = async (id) => {
  try {
    await deleteRecord('pool_tecnico', `id = ${id}`);
  } catch (error) {
    console.error('Erro ao excluir pool_tecnico:', error);
    throw error;
  }
};

export { listarPoolTecnico, obterPoolTecnicoPorId, criarPoolTecnico, atualizarPoolTecnico, excluirPoolTecnico };
