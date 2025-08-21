'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/AuthContext';
import {
  Users,
  Ticket,
  Settings,
  BarChart3,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Activity
} from 'lucide-react';

// Configuração da API
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080';

// Função utilitária para fazer requisições HTTP
const apiRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API Request Error:', error);
    throw error;
  }
};

// Função para lidar com erros da API
const handleAPIError = (error) => {
  if (error.message.includes('401')) {
    // Redirecionar para login em caso de erro de autenticação
    window.location.href = '/';
  } else if (error.message.includes('403')) {
    alert('Você não tem permissão para realizar esta ação');
  } else if (error.message.includes('404')) {
    alert('Recurso não encontrado');
  } else if (error.message.includes('500')) {
    alert('Erro interno do servidor. Tente novamente mais tarde.');
  } else {
    alert('Ocorreu um erro inesperado. Tente novamente.');
  }
};

// Componente de Card de Estatística
const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        {change && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-600' : 'text-red-600'}`}>
            {change > 0 ? '+' : ''}{change}% vs mês anterior
          </p>
        )}
      </div>
      <div className={`p-3 rounded-lg ${color}`}>
        <Icon className="w-6 h-6 text-white" />
      </div>
    </div>
  </div>
);

// Componente de Tabela de Chamados
const ChamadosTable = ({ chamados, onEdit, onDelete, onView, loading }) => (
  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
    <div className="px-6 py-4 border-b border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900">Chamados Recentes</h3>
    </div>
    <div className="overflow-x-auto">
      {loading ? (
        <div className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando chamados...</p>
        </div>
      ) : (
        <table className="w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Patrimônio</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prioridade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Data</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {chamados.length === 0 ? (
              <tr>
                <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                  Nenhum chamado encontrado
                </td>
              </tr>
            ) : (
              chamados.map((chamado) => (
                <tr key={chamado.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{chamado.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chamado.titulo}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{chamado.patrimonio}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={chamado.estado}
                      onChange={async (e) => {
                        try {
                          const newEstado = e.target.value;
                          await apiRequest(`/chamados/${chamado.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ ...chamado, estado: newEstado }),
                          });
                          // Atualiza o estado local
                          setChamados(chamados.map(c =>
                            c.id === chamado.id ? { ...c, estado: newEstado } : c
                          ));
                        } catch (error) {
                          console.error('Erro ao atualizar estado:', error);
                          handleAPIError(error);
                        }
                      }}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${chamado.estado === 'aberto' ? 'bg-blue-100 text-blue-800' :
                          chamado.estado === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                            chamado.estado === 'concluido' ? 'bg-green-100 text-green-800' :
                              'bg-gray-100 text-gray-800'
                        }`}
                    >
                      <option value="aberto">Aberto</option>
                      <option value="em_andamento">Em Andamento</option>
                      <option value="concluido">Concluído</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={chamado.prioridade || 'media'}
                      onChange={async (e) => {
                        try {
                          const newPrioridade = e.target.value;
                          await apiRequest(`/chamados/${chamado.id}`, {
                            method: 'PUT',
                            body: JSON.stringify({ ...chamado, prioridade: newPrioridade }),
                          });
                          // Atualiza a prioridade local
                          setChamados(chamados.map(c =>
                            c.id === chamado.id ? { ...c, prioridade: newPrioridade } : c
                          ));
                        } catch (error) {
                          console.error('Erro ao atualizar prioridade:', error);
                          handleAPIError(error);
                        }
                      }}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 focus:ring-2 focus:ring-blue-500 ${(chamado.prioridade || 'media') === 'baixa' ? 'bg-green-100 text-green-800' :
                          (chamado.prioridade || 'media') === 'media' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}
                    >
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {chamado.created_at ? new Date(chamado.created_at).toLocaleDateString('pt-BR') : 'N/A'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onView(chamado)}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onEdit(chamado)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDelete(chamado.id)}
                        className="text-red-600 hover:text-red-900 p-1 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  </div>
);

// Componente de Modal para Criar/Editar Chamado
const ChamadoModal = ({ isOpen, onClose, chamado, onSubmit, isEditing, loading }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    patrimonio: '',
    descricao: '',
    tipo_id: '',
    tecnico_id: '',
    usuario_id: '',
    estado: 'aberto'
  });

  useEffect(() => {
    if (chamado && isEditing) {
      setFormData({
        titulo: chamado.titulo || '',
        patrimonio: chamado.patrimonio || '',
        descricao: chamado.descricao || '',
        tipo_id: chamado.tipo_id || '',
        tecnico_id: chamado.tecnico_id || '',
        usuario_id: chamado.usuario_id || '',
        estado: chamado.estado || 'aberto'
      });
    } else {
      setFormData({
        titulo: '',
        patrimonio: '',
        descricao: '',
        tipo_id: '',
        tecnico_id: '',
        usuario_id: '',
        estado: 'aberto'
      });
    }
  }, [chamado, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Editar Chamado' : 'Novo Chamado'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Patrimônio</label>
            <input
              type="text"
              value={formData.patrimonio}
              onChange={(e) => setFormData({ ...formData, patrimonio: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="7 dígitos"
              maxLength="7"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Tipo ID</label>
            <input
              type="number"
              value={formData.tipo_id}
              onChange={(e) => setFormData({ ...formData, tipo_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Técnico ID</label>
            <input
              type="number"
              value={formData.tecnico_id}
              onChange={(e) => setFormData({ ...formData, tecnico_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Usuário ID</label>
            <input
              type="number"
              value={formData.usuario_id}
              onChange={(e) => setFormData({ ...formData, usuario_id: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="aberto">Aberto</option>
              <option value="em_andamento">Em Andamento</option>
              <option value="concluido">Concluído</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Modal para Visualizar Chamado
const ViewChamadoModal = ({ isOpen, onClose, chamado }) => {
  if (!isOpen || !chamado) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Detalhes do Chamado #{chamado.id}</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <p className="text-gray-900">{chamado.titulo}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <p className="text-gray-900">{chamado.descricao}</p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${chamado.estado === 'aberto' ? 'bg-blue-100 text-blue-800' :
                  chamado.estado === 'em_andamento' ? 'bg-yellow-100 text-yellow-800' :
                    chamado.estado === 'concluido' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                }`}>
                {chamado.estado}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Prioridade</label>
              <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${(chamado.prioridade || 'media') === 'baixa' ? 'bg-green-100 text-green-800' :
                  (chamado.prioridade || 'media') === 'media' ? 'bg-yellow-100 text-yellow-800' :
                    'bg-red-100 text-red-800'
                }`}>
                {chamado.prioridade || 'Média'}
              </span>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Patrimônio</label>
              <p className="text-gray-900">{chamado.patrimonio}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipo ID</label>
              <p className="text-gray-900">{chamado.tipo_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Técnico ID</label>
              <p className="text-gray-900">{chamado.tecnico_id}</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Usuário ID</label>
              <p className="text-gray-900">{chamado.usuario_id}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data de Criação</label>
              <p className="text-gray-900">{chamado.created_at ? new Date(chamado.created_at).toLocaleDateString('pt-BR') : 'N/A'}</p>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <button
            onClick={onClose}
            className="w-full bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Fechar
          </button>
        </div>
      </div>
    </div>
  );
};

// Componente de Modal para Criar/Editar Usuário
const UsuarioModal = ({ isOpen, onClose, usuario, onSubmit, isEditing, loading }) => {
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    senha: '',
    funcao: 'usuario',
    estado: 'ativo'
  });

  useEffect(() => {
    if (usuario && isEditing) {
      setFormData({
        nome: usuario.nome || '',
        email: usuario.email || '',
        senha: '',
        funcao: usuario.funcao || 'usuario',
        estado: usuario.estado || 'ativo'
      });
    } else {
      setFormData({
        nome: '',
        email: '',
        senha: '',
        funcao: 'usuario',
        estado: 'ativo'
      });
    }
  }, [usuario, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Editar Usuário' : 'Novo Usuário'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input
              type="text"
              value={formData.nome}
              onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              {isEditing ? 'Nova Senha (deixe em branco para manter)' : 'Senha'}
            </label>
            <input
              type="password"
              value={formData.senha}
              onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required={!isEditing}
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Função</label>
            <select
              value={formData.funcao}
              onChange={(e) => setFormData({ ...formData, funcao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="usuario">Usuário</option>
              <option value="tecnico">Técnico</option>
              <option value="administrador">Administrador</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select
              value={formData.estado}
              onChange={(e) => setFormData({ ...formData, estado: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              disabled={loading}
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
            </select>
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Componente de Modal para Criar/Editar Tipo de Equipamento
const EquipamentoModal = ({ isOpen, onClose, equipamento, onSubmit, isEditing, loading }) => {
  const [formData, setFormData] = useState({
    titulo: '',
    descricao: '',
    created_by: 1, // ID do admin atual (hardcoded por enquanto)
    updated_by: 1
  });

  useEffect(() => {
    if (equipamento && isEditing) {
      setFormData({
        titulo: equipamento.titulo || '',
        descricao: equipamento.descricao || '',
        created_by: equipamento.created_by || 1,
        updated_by: 1
      });
    } else {
      setFormData({
        titulo: '',
        descricao: '',
        created_by: 1,
        updated_by: 1
      });
    }
  }, [equipamento, isEditing]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-6 w-full max-w-md mx-4">
        <h2 className="text-xl font-bold mb-4">
          {isEditing ? 'Editar Tipo de Equipamento' : 'Novo Tipo de Equipamento'}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Título</label>
            <input
              type="text"
              value={formData.titulo}
              onChange={(e) => setFormData({ ...formData, titulo: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
              disabled={loading}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Descrição</label>
            <textarea
              value={formData.descricao}
              onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="3"
              required
              disabled={loading}
            />
          </div>
          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400 transition duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [chamados, setChamados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [editingChamado, setEditingChamado] = useState(null);
  const [selectedChamado, setSelectedChamado] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalLoading, setModalLoading] = useState(false);

  // Estados para usuários
  const [isUsuarioModalOpen, setIsUsuarioModalOpen] = useState(false);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [modalUsuarioLoading, setModalUsuarioLoading] = useState(false);

  // Estados para equipamentos
  const [isEquipamentoModalOpen, setIsEquipamentoModalOpen] = useState(false);
  const [editingEquipamento, setEditingEquipamento] = useState(null);
  const [modalEquipamentoLoading, setModalEquipamentoLoading] = useState(false);

  const [stats, setStats] = useState({
    total: 0,
    abertos: 0,
    emAndamento: 0,
    concluidos: 0
  });

  const { user, loading: authLoading } = useAuth();
  const { logout } = useAuth();
  const router = useRouter();

  // Verificar autenticação e redirecionar se não estiver autenticado
  useEffect(() => {
    if (!authLoading && !user) {
      router.push('/');
    }
  }, [user, authLoading, router]);

  // Carregar dados iniciais
  useEffect(() => {
    if (user && user.funcao === 'administrador') {
      loadInitialData();
    }
  }, [user]);

  const loadInitialData = async () => {
    try {
      setLoading(true);

      // Carregar chamados
      const chamadosData = await apiRequest('/chamados');
      setChamados(chamadosData);

      // Carregar usuários
      const usuariosData = await apiRequest('/usuarios');
      setUsuarios(usuariosData);

      // Carregar tipos de equipamentos
      const equipamentosData = await apiRequest('/pool');
      setEquipamentos(equipamentosData);

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
      handleAPIError(error);
      setLoading(false);
    }
  };

  const handleCreateChamado = async (formData) => {
    try {
      setModalLoading(true);
      const newChamado = await apiRequest('/chamados', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setChamados([newChamado, ...chamados]);
      setIsModalOpen(false);
      setEditingChamado(null);
    } catch (error) {
      console.error('Erro ao criar chamado:', error);
      handleAPIError(error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleEditChamado = (chamado) => {
    setEditingChamado(chamado);
    setIsModalOpen(true);
  };

  const handleUpdateChamado = async (formData) => {
    try {
      setModalLoading(true);
      const updatedChamado = await apiRequest(`/chamados/${editingChamado.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setChamados(chamados.map(c =>
        c.id === editingChamado.id ? updatedChamado : c
      ));
      setIsModalOpen(false);
      setEditingChamado(null);
    } catch (error) {
      console.error('Erro ao atualizar chamado:', error);
      handleAPIError(error);
    } finally {
      setModalLoading(false);
    }
  };

  const handleDeleteChamado = async (id) => {
    if (confirm('Tem certeza que deseja excluir este chamado?')) {
      try {
        await apiRequest(`/chamados/${id}`, { method: 'DELETE' });
        setChamados(chamados.filter(c => c.id !== id));
      } catch (error) {
        console.error('Erro ao excluir chamado:', error);
        handleAPIError(error);
      }
    }
  };

  const handleViewChamado = (chamado) => {
    setSelectedChamado(chamado);
    setIsViewModalOpen(true);
  };

  const handleSubmit = (formData) => {
    if (editingChamado) {
      handleUpdateChamado(formData);
    } else {
      handleCreateChamado(formData);
    }
  };

  // ===== FUNÇÕES PARA USUÁRIOS =====
  const handleCreateUsuario = async (formData) => {
    try {
      setModalUsuarioLoading(true);
      const newUsuario = await apiRequest('/usuarios', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setUsuarios([newUsuario, ...usuarios]);
      setIsUsuarioModalOpen(false);
      setEditingUsuario(null);
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      handleAPIError(error);
    } finally {
      setModalUsuarioLoading(false);
    }
  };

  const handleEditUsuario = (usuario) => {
    setEditingUsuario(usuario);
    setIsUsuarioModalOpen(true);
  };

  const handleUpdateUsuario = async (formData) => {
    try {
      setModalUsuarioLoading(true);

      // Se a senha estiver vazia na edição, remove do formData
      const dataToSend = { ...formData };
      if (editingUsuario && !dataToSend.senha) {
        delete dataToSend.senha;
      }

      const updatedUsuario = await apiRequest(`/usuarios/${editingUsuario.id}`, {
        method: 'PUT',
        body: JSON.stringify(dataToSend),
      });
      setUsuarios(usuarios.map(u =>
        u.id === editingUsuario.id ? updatedUsuario : u
      ));
      setIsUsuarioModalOpen(false);
      setEditingUsuario(null);
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      handleAPIError(error);
    } finally {
      setModalUsuarioLoading(false);
    }
  };

  const handleDeleteUsuario = async (id) => {
    if (confirm('Tem certeza que deseja excluir este usuário?')) {
      try {
        await apiRequest(`/usuarios/${id}`, { method: 'DELETE' });
        setUsuarios(usuarios.filter(u => u.id !== id));
      } catch (error) {
        console.error('Erro ao excluir usuário:', error);
        handleAPIError(error);
      }
    }
  };

  const handleSubmitUsuario = (formData) => {
    if (editingUsuario) {
      handleUpdateUsuario(formData);
    } else {
      handleCreateUsuario(formData);
    }
  };

  // ===== FUNÇÕES PARA EQUIPAMENTOS =====
  const handleCreateEquipamento = async (formData) => {
    try {
      setModalEquipamentoLoading(true);
      const newEquipamento = await apiRequest('/pool', {
        method: 'POST',
        body: JSON.stringify(formData),
      });
      setEquipamentos([newEquipamento, ...equipamentos]);
      setIsEquipamentoModalOpen(false);
      setEditingEquipamento(null);
    } catch (error) {
      console.error('Erro ao criar tipo de equipamento:', error);
      handleAPIError(error);
    } finally {
      setModalEquipamentoLoading(false);
    }
  };

  const handleEditEquipamento = (equipamento) => {
    setEditingEquipamento(equipamento);
    setIsEquipamentoModalOpen(true);
  };

  const handleUpdateEquipamento = async (formData) => {
    try {
      setModalEquipamentoLoading(true);
      const updatedEquipamento = await apiRequest(`/pool/${editingEquipamento.id}`, {
        method: 'PUT',
        body: JSON.stringify(formData),
      });
      setEquipamentos(equipamentos.map(e =>
        e.id === editingEquipamento.id ? updatedEquipamento : e
      ));
      setIsEquipamentoModalOpen(false);
      setEditingEquipamento(null);
    } catch (error) {
      console.error('Erro ao atualizar tipo de equipamento:', error);
      handleAPIError(error);
    } finally {
      setModalEquipamentoLoading(false);
    }
  };

  const handleDeleteEquipamento = async (id) => {
    if (confirm('Tem certeza que deseja excluir este tipo de equipamento?')) {
      try {
        await apiRequest(`/pool/${id}`, { method: 'DELETE' });
        setEquipamentos(equipamentos.filter(e => e.id !== id));
      } catch (error) {
        console.error('Erro ao excluir tipo de equipamento:', error);
        handleAPIError(error);
      }
    }
  };

  const handleSubmitEquipamento = (formData) => {
    if (editingEquipamento) {
      handleUpdateEquipamento(formData);
    } else {
      handleCreateEquipamento(formData);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Carregando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-gray-900">Painel Administrativo</h1>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">Admin</span>
              <button
                onClick={logout}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200"
              >
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs de Navegação */}
        <nav className="flex space-x-8 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'chamados', label: 'Chamados', icon: Ticket },
            { id: 'usuarios', label: 'Usuários', icon: Users },
            { id: 'equipamentos', label: 'Equipamentos', icon: Settings },
            { id: 'relatorios', label: 'Relatórios', icon: Activity }
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${activeTab === tab.id
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                  }`}
              >
                <Icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Conteúdo das Tabs */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Cards de Estatísticas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                title="Total de Chamados"
                value={chamados.length}
                icon={Ticket}
                change={12}
                color="bg-blue-500"
              />
              <StatCard
                title="Chamados Abertos"
                value={chamados.filter(c => c.estado === 'aberto').length}
                icon={AlertCircle}
                change={-5}
                color="bg-red-500"
              />
              <StatCard
                title="Em Andamento"
                value={chamados.filter(c => c.estado === 'em_andamento').length}
                icon={Clock}
                change={8}
                color="bg-yellow-500"
              />
              <StatCard
                title="Concluídos"
                value={chamados.filter(c => c.estado === 'concluido').length}
                icon={CheckCircle}
                change={15}
                color="bg-green-500"
              />
            </div>

            {/* Gráfico de Chamados por Status */}
            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Chamados por Status</h3>
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {chamados.filter(c => c.estado === 'aberto').length}
                  </div>
                  <div className="text-sm text-gray-600">Abertos</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-600">
                    {chamados.filter(c => c.estado === 'em_andamento').length}
                  </div>
                  <div className="text-sm text-gray-600">Em Andamento</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {chamados.filter(c => c.estado === 'concluido').length}
                  </div>
                  <div className="text-sm text-gray-600">Concluídos</div>
                </div>
              </div>
            </div>

            {/* Tabela de Chamados Recentes */}
            <ChamadosTable
              chamados={chamados.slice(0, 5)}
              onEdit={handleEditChamado}
              onDelete={handleDeleteChamado}
              onView={handleViewChamado}
              loading={false}
            />
          </div>
        )}

        {activeTab === 'chamados' && (
          <div className="space-y-6">
            {/* Header com Botão de Criar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Chamados</h2>
              <button
                onClick={() => {
                  setEditingChamado(null);
                  setIsModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-6 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Chamado</span>
              </button>
            </div>

            {/* Filtros e Busca */}
            <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200">
              <div className="flex space-x-4">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <input
                      type="text"
                      placeholder="Buscar chamados..."
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <select className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                  <option value="">Todos os Estados</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>

            {/* Tabela Completa de Chamados */}
            <ChamadosTable
              chamados={chamados}
              onEdit={handleEditChamado}
              onDelete={handleDeleteChamado}
              onView={handleViewChamado}
              loading={false}
            />
          </div>
        )}

        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            {/* Header com Botão de Criar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Usuários</h2>
              <button
                onClick={() => {
                  setEditingUsuario(null);
                  setIsUsuarioModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-6 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Usuário</span>
              </button>
            </div>

            {/* Tabela de Usuários */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Usuários</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Função</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-gray-500">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    ) : (
                      usuarios.map((usuario) => (
                        <tr key={usuario.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{usuario.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nome}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.email}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.funcao}</td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${usuario.estado === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                              }`}>
                              {usuario.estado}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditUsuario(usuario)}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteUsuario(usuario.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'equipamentos' && (
          <div className="space-y-6">
            {/* Header com Botão de Criar */}
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-gray-900">Gerenciar Tipos de Equipamentos</h2>
              <button
                onClick={() => {
                  setEditingEquipamento(null);
                  setIsEquipamentoModalOpen(true);
                }}
                className="bg-blue-600 text-white px-4 py-6 rounded-lg hover:bg-blue-700 transition duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Tipo</span>
              </button>
            </div>

            {/* Tabela de Tipos de Equipamentos */}
            <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">Tipos de Equipamentos</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Criado por</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipamentos.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                          Nenhum tipo de equipamento encontrado
                        </td>
                      </tr>
                    ) : (
                      equipamentos.map((equipamento) => (
                        <tr key={equipamento.id} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">#{equipamento.id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipamento.titulo}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipamento.descricao}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{equipamento.created_by}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <div className="flex space-x-2">
                              <button
                                onClick={() => handleEditEquipamento(equipamento)}
                                className="text-green-600 hover:text-green-900 p-1 rounded"
                              >
                                <Edit className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteEquipamento(equipamento.id)}
                                className="text-red-600 hover:text-red-900 p-1 rounded"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'relatorios' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Relatórios</h2>

            {/* Resumo Geral */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Chamados</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{chamados.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Abertos:</span>
                    <span className="font-semibold text-blue-600">{chamados.filter(c => c.estado === 'aberto').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Em Andamento:</span>
                    <span className="font-semibold text-yellow-600">{chamados.filter(c => c.estado === 'em_andamento').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Concluídos:</span>
                    <span className="font-semibold text-green-600">{chamados.filter(c => c.estado === 'concluido').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Resumo de Usuários</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{usuarios.length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Administradores:</span>
                    <span className="font-semibold text-purple-600">{usuarios.filter(u => u.funcao === 'administrador').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Técnicos:</span>
                    <span className="font-semibold text-blue-600">{usuarios.filter(u => u.funcao === 'tecnico').length}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Usuários:</span>
                    <span className="font-semibold text-green-600">{usuarios.filter(u => u.funcao === 'usuario').length}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Tipos de Equipamentos</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total:</span>
                    <span className="font-semibold">{equipamentos.length}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Modais */}
      <ChamadoModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingChamado(null);
        }}
        chamado={editingChamado}
        onSubmit={handleSubmit}
        isEditing={!!editingChamado}
        loading={modalLoading}
      />

      <ViewChamadoModal
        isOpen={isViewModalOpen}
        onClose={() => {
          setIsViewModalOpen(false);
          setSelectedChamado(null);
        }}
        chamado={selectedChamado}
      />

      <UsuarioModal
        isOpen={isUsuarioModalOpen}
        onClose={() => {
          setIsUsuarioModalOpen(false);
          setEditingUsuario(null);
        }}
        usuario={editingUsuario}
        onSubmit={handleSubmitUsuario}
        isEditing={!!editingUsuario}
        loading={modalUsuarioLoading}
      />

      <EquipamentoModal
        isOpen={isEquipamentoModalOpen}
        onClose={() => {
          setIsEquipamentoModalOpen(false);
          setEditingEquipamento(null);
        }}
        equipamento={editingEquipamento}
        onSubmit={handleSubmitEquipamento}
        isEditing={!!editingEquipamento}
        loading={modalEquipamentoLoading}
      />
    </div>
  );
}
