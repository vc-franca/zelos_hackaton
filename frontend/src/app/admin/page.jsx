'use client';

import { useState, useEffect , useRef  } from 'react';
import { useRouter } from 'next/navigation';
import {
  Users,
  Ticket,
  Settings,
  BarChart3,
  Plus,
  Search,
  Edit,
  Trash2,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/* ============================
   UI Components
   ============================ */

const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="bg-[#1B1F3B] p-6 rounded-xl shadow-lg border border-[#FFFDF7]/10">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-[#FFFDF7]/70">{title}</p>
        <p className="text-2xl font-bold text-[#FFFDF7] mt-1">{value}</p>
        {change !== undefined && (
          <p className={`text-sm mt-1 ${change > 0 ? 'text-green-400' : 'text-red-400'}`}>
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

function Toasts({ toasts, removeToast }) {
  return (
    <div className="fixed right-6 bottom-6 z-50 flex flex-col gap-3">
      {toasts.map(t => (
        <div
          key={t.id}
          className={`w-96 max-w-full transform transition-all duration-300 shadow-lg rounded-lg overflow-hidden flex items-start gap-4 p-4 ${
            t.type === 'success' ? 'bg-gradient-to-r from-green-50 to-white border border-green-200' : 'bg-gradient-to-r from-red-50 to-white border border-red-200'
          }`}
          role="status"
        >
          <div className="mt-0.5">
            {t.type === 'success' ? <CheckCircle className="w-6 h-6 text-green-600" /> : <AlertCircle className="w-6 h-6 text-red-600" />}
          </div>
          <div className="flex-1">
            <p className="text-sm font-semibold text-gray-900">{t.title}</p>
            <p className="text-sm text-gray-700 mt-1">{t.message}</p>
          </div>
          <button
            onClick={() => removeToast(t.id)}
            className="text-gray-400 hover:text-gray-600 ml-2"
            aria-label="Fechar"
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}

/* ============================
   Modal Components
   ============================ */

function ChamadoModal({ isOpen, onClose, onSubmit, initial = null, tipos = [], usuarios = [], tecnicos = [], loading }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    patrimonio: '',
    tipo_id: '',
    tecnico_id: '',
    usuario_id: '',
    estado: 'pendente'
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        titulo: initial.titulo || '',
        descricao: initial.descricao || '',
        patrimonio: initial.patrimonio ? String(initial.patrimonio).padStart(7, '0') : '',
        tipo_id: String(initial.tipo_id || ''),
        tecnico_id: String(initial.tecnico_id || ''),
        usuario_id: String(initial.usuario_id || ''),
        estado: initial.estado || 'pendente'
      });
      setFormErrors({});
    } else {
      setForm({
        titulo: '',
        descricao: '',
        patrimonio: '',
        tipo_id: '',
        tecnico_id: '',
        usuario_id: '',
        estado: 'pendente'
      });
      setFormErrors({});
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    if (!form.titulo) errors.titulo = 'Título é obrigatório';
    if (!form.descricao) errors.descricao = 'Descrição é obrigatória';
    if (!form.patrimonio || form.patrimonio.length !== 7 || !/^\d{7}$/.test(form.patrimonio)) {
      errors.patrimonio = 'Patrimônio deve ter exatamente 7 dígitos numéricos';
    }
    if (!form.tipo_id) errors.tipo_id = 'Tipo é obrigatório';
    if (!form.usuario_id) errors.usuario_id = 'Solicitante é obrigatório';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = {
      ...form,
      tipo_id: form.tipo_id ? Number(form.tipo_id) : null,
      tecnico_id: form.tecnico_id ? Number(form.tecnico_id) : null,
      usuario_id: form.usuario_id ? Number(form.usuario_id) : null,
      patrimonio: Number(form.patrimonio)
    };

    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'patrimonio') {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 7);
      setForm((prev) => ({ ...prev, [name]: numbersOnly }));
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2D3250] rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#FFFDF7]">{isEditing ? 'Editar Chamado' : 'Novo Chamado'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Título</label>
            <input 
              name="titulo"
              value={form.titulo} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
            />
            {formErrors.titulo && <p className="text-[#E31B23] text-xs mt-1">{formErrors.titulo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Descrição</label>
            <textarea 
              name="descricao"
              value={form.descricao} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              rows={3}
            />
            {formErrors.descricao && <p className="text-[#E31B23] text-xs mt-1">{formErrors.descricao}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Patrimônio (7 dígitos)</label>
              <input 
                name="patrimonio"
                value={form.patrimonio} 
                onChange={handleChange}
                placeholder="0000001"
                maxLength={7}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              />
              {formErrors.patrimonio && <p className="text-[#E31B23] text-xs mt-1">{formErrors.patrimonio}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Tipo</label>
              <select 
                name="tipo_id"
                value={form.tipo_id} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              >
                <option value="">Selecione o tipo</option>
                {tipos.map(t => (
                  <option key={t.id} value={t.id}>{t.titulo}</option>
                ))}
              </select>
              {formErrors.tipo_id && <p className="text-[#E31B23] text-xs mt-1">{formErrors.tipo_id}</p>}
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Técnico</label>
              <select 
                name="tecnico_id"
                value={form.tecnico_id || ''} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              >
                <option value="">Sem técnico</option>
                {tecnicos.map(u => (
                  <option key={u.id} value={u.id}>{u.nome}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Solicitante</label>
              <select 
                name="usuario_id"
                value={form.usuario_id} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              >
                <option value="">Selecione o usuário</option>
                {usuarios.map(u => (
                  <option key={u.id} value={u.id}>{u.nome} ({u.funcao})</option>
                ))}
              </select>
              {formErrors.usuario_id && <p className="text-[#E31B23] text-xs mt-1">{formErrors.usuario_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Estado</label>
              <select 
                name="estado"
                value={form.estado} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              >
                <option value="pendente">Pendente</option>
                <option value="em andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg hover:bg-[#FFFDF7]/30 transition duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function UsuarioModal({ isOpen, onClose, onSubmit, initial = null, isEditing = false, loading }) {
  const [form, setForm] = useState({ 
    nome: '', 
    email: '', 
    senha: '', 
    funcao: 'usuario', 
    estado: 'ativo' 
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        nome: initial.nome || '',
        email: initial.email || '',
        senha: '',
        funcao: initial.funcao || 'usuario',
        estado: initial.estado || 'ativo'
      });
      setFormErrors({});
    } else {
      setForm({ nome: '', email: '', senha: '', funcao: 'usuario', estado: 'ativo' });
      setFormErrors({});
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    if (!isEditing) {
      // Apenas valida nome e email se não estiver editando
      if (!form.nome) errors.nome = 'Nome é obrigatório';
      if (!form.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
        errors.email = 'Email válido é obrigatório';
      }
    }
    // Sempre valida a senha se for nova ou se estiver editando e a senha foi preenchida
    if (!isEditing && !form.senha) {
      errors.senha = 'Senha é obrigatória para novos usuários';
    } else if (form.senha && form.senha.length < 6) {
      errors.senha = 'Senha deve ter pelo menos 6 caracteres';
    }
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = { ...form };
    if (isEditing) {
      // No modo de edição, envia apenas a senha (se preenchida) e o estado (caso queira permitir mudar o estado)
      // Remove nome, email e função para não atualizar
      delete data.nome;
      delete data.email;
      delete data.funcao;
      if (!data.senha) {
        delete data.senha;
      }
    }

    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2D3250] rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-[#FFFDF7]">{isEditing ? 'Alterar Senha do Usuário' : 'Novo Usuário'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Nome</label>
            <input 
              name="nome"
              value={form.nome} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              disabled={isEditing} // Desabilita no modo edição
              readOnly={isEditing} // Torna somente leitura
            />
            {formErrors.nome && <p className="text-[#E31B23] text-xs mt-1">{formErrors.nome}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Email</label>
            <input 
              type="email"
              name="email"
              value={form.email} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              disabled={isEditing} // Desabilita no modo edição
              readOnly={isEditing} // Torna somente leitura
            />
            {formErrors.email && <p className="text-[#E31B23] text-xs mt-1">{formErrors.email}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">
              {isEditing ? 'Nova senha (deixe em branco para manter a atual)' : 'Senha'}
            </label>
            <input 
              type="password" 
              name="senha"
              value={form.senha} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              minLength="6"
            />
            {formErrors.senha && <p className="text-[#E31B23] text-xs mt-1">{formErrors.senha}</p>}
          </div>

          {!isEditing && ( // Apenas mostra função e estado ao criar novo usuário
            <>
              <div>
                <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Função</label>
                <select 
                  name="funcao"
                  value={form.funcao} 
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
                >
                  <option value="usuario">Usuário</option>
                  <option value="tecnico">Técnico</option>
                  <option value="administrador">Administrador</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Estado</label>
                <select 
                  name="estado"
                  value={form.estado} 
                  onChange={handleChange}
                  className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
                >
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                </select>
              </div>
            </>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg hover:bg-[#FFFDF7]/30 transition duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar Senha' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function TipoModal({ isOpen, onClose, onSubmit, initial = null, loading }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({ titulo: '', descricao: '' });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({ 
        titulo: initial.titulo || '', 
        descricao: initial.descricao || '' 
      });
      setFormErrors({});
    } else {
      setForm({ titulo: '', descricao: '' });
      setFormErrors({});
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    if (!form.titulo) errors.titulo = 'Título é obrigatório';
    if (!form.descricao) errors.descricao = 'Descrição é obrigatória';
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = {
      ...form,
      created_by: 1, // Assume admin ID, adjust if needed
      updated_by: 1
    };

    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2D3250] rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-[#FFFDF7]">{isEditing ? 'Editar Tipo de Serviço' : 'Novo Tipo de Serviço'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Título</label>
            <input
              name="titulo"
              value={form.titulo}
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              placeholder="Ex: Manutenção"
              disabled={isEditing}
            />
            {formErrors.titulo && <p className="text-[#E31B23] text-xs mt-1">{formErrors.titulo}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Descrição</label>
            <textarea 
              name="descricao"
              value={form.descricao} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              rows={3}
              placeholder="Descreva este tipo de serviço..."
            />
            {formErrors.descricao && <p className="text-[#E31B23] text-xs mt-1">{formErrors.descricao}</p>}
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg hover:bg-[#FFFDF7]/30 transition duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================
   Apontamento Modal Component
   ============================ */

function ApontamentoModal({ isOpen, onClose, onSubmit, initial = null, chamados = [], tecnicos = [], loading }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({
    chamado_id: '',
    tecnico_id: '',
    descricao: '',
    comeco: '',
    fim: ''
  });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    if (initial) {
      setForm({
        chamado_id: String(initial.chamado_id || ''),
        tecnico_id: String(initial.tecnico_id || ''),
        descricao: initial.descricao || '',
        comeco: initial.comeco ? new Date(initial.comeco).toISOString().slice(0, 16) : '',
        fim: initial.fim ? new Date(initial.fim).toISOString().slice(0, 16) : ''
      });
      setFormErrors({});
    } else {
      setForm({
        chamado_id: '',
        tecnico_id: '',
        descricao: '',
        comeco: '',
        fim: ''
      });
      setFormErrors({});
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    const errors = {};
    if (!form.chamado_id) errors.chamado_id = 'Chamado é obrigatório';
    if (!form.tecnico_id) errors.tecnico_id = 'Técnico é obrigatório';
    if (!form.descricao) errors.descricao = 'Descrição é obrigatória';
    if (!form.comeco) errors.comeco = 'Data de início é obrigatória';
    if (!form.fim) errors.fim = 'Data de fim é obrigatória';
    
    if (form.comeco && form.fim && new Date(form.comeco) >= new Date(form.fim)) {
      errors.fim = 'Data de fim deve ser posterior à data de início';
    }
    
    return errors;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const data = {
      ...form,
      chamado_id: Number(form.chamado_id),
      tecnico_id: Number(form.tecnico_id)
    };

    onSubmit(data);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    setFormErrors((prev) => ({ ...prev, [name]: "" }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-[#2D3250] rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-[#FFFDF7]">{isEditing ? 'Editar Apontamento' : 'Novo Apontamento'}</h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Chamado</label>
              <select 
                name="chamado_id"
                value={form.chamado_id} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              >
                <option value="">Selecione o chamado</option>
                {chamados.map(c => (
                  <option key={c.id} value={c.id}>#{c.id} — {c.titulo}</option>
                ))}
              </select>
              {formErrors.chamado_id && <p className="text-[#E31B23] text-xs mt-1">{formErrors.chamado_id}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Técnico</label>
              <select 
                name="tecnico_id"
                value={form.tecnico_id} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              >
                <option value="">Selecione o técnico</option>
                {tecnicos.map(t => (
                  <option key={t.id} value={t.id}>{t.nome}</option>
                ))}
              </select>
              {formErrors.tecnico_id && <p className="text-[#E31B23] text-xs mt-1">{formErrors.tecnico_id}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Descrição</label>
            <textarea 
              name="descricao"
              value={form.descricao} 
              onChange={handleChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              rows={3}
              placeholder="Descreva o trabalho realizado..."
            />
            {formErrors.descricao && <p className="text-[#E31B23] text-xs mt-1">{formErrors.descricao}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Data/Hora de Início</label>
              <input 
                type="datetime-local"
                name="comeco"
                value={form.comeco} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              />
              {formErrors.comeco && <p className="text-[#E31B23] text-xs mt-1">{formErrors.comeco}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-[#FFFDF7] mb-1">Data/Hora de Fim</label>
              <input 
                type="datetime-local"
                name="fim"
                value={form.fim} 
                onChange={handleChange}
                className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none" 
              />
              {formErrors.fim && <p className="text-[#E31B23] text-xs mt-1">{formErrors.fim}</p>}
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button 
              type="button" 
              onClick={onClose} 
              className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg hover:bg-[#FFFDF7]/30 transition duration-200"
            >
              Cancelar
            </button>
            <button 
              type="submit" 
              disabled={loading} 
              className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 disabled:opacity-50"
            >
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================
   Export Helper Component
   ============================ */

function ExportChamadoForm({ chamados, onExport }) {
  const [selectedId, setSelectedId] = useState('');
  
  return (
    <div className="space-y-3">
      <select 
        value={selectedId} 
        onChange={(e) => setSelectedId(e.target.value)}
        className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
      >
        <option value="">Selecione um Chamado</option>
        {chamados.map(c => (
          <option key={c.id} value={c.id}>#{c.id} — {c.titulo}</option>
        ))}
      </select>

      <div className="flex gap-2">
        <button 
          onClick={() => {
            if (!selectedId) {
              alert('Escolha um chamado');
              return;
            }
            onExport(selectedId, 'pdf');
          }} 
          className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200"
        >
          Exportar PDF
        </button>

        <button 
          onClick={() => {
            if (!selectedId) {
              alert('Escolha um chamado');
              return;
            }
            onExport(selectedId, 'excel');
          }} 
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
        >
          Exportar Excel
        </button>
      </div>
    </div>
  );
}

/* ============================
   Main Admin Page Component
   ============================ */

export default function AdminPage() {
  const router = useRouter();

  // State management
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentUser, setCurrentUser] = useState(null);

  // Data states
  const [chamados, setChamados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [apontamentos, setApontamentos] = useState([]);

  // UI states
  const [loading, setLoading] = useState(false);
  const [genericLoading, setGenericLoading] = useState(false);

  // Modal states
  const [modalChamadoOpen, setModalChamadoOpen] = useState(false);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [modalTipoOpen, setModalTipoOpen] = useState(false);
  const [modalApontamentoOpen, setModalApontamentoOpen] = useState(false);

  // Editing states
  const [editingChamado, setEditingChamado] = useState(null);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [editingTipo, setEditingTipo] = useState(null);
  const [editingApontamento, setEditingApontamento] = useState(null);

  // Search states
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Toast system
  const [toasts, setToasts] = useState([]);
  const toastTimerRef = useRef({});

  const addToast = (type, title, message, duration = 4000) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
    setToasts(prev => [...prev, { id, type, title, message }]);
    
    if (toastTimerRef.current[id]) clearTimeout(toastTimerRef.current[id]);
    toastTimerRef.current[id] = setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
      delete toastTimerRef.current[id];
    }, duration);
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
    if (toastTimerRef.current[id]) {
      clearTimeout(toastTimerRef.current[id]);
      delete toastTimerRef.current[id];
    }
  };

  /* ============================
     Authentication & Data Loading
     ============================ */

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch('http://localhost:8080/auth/check-auth', {
          credentials: 'include',
        });
        const data = await response.json();
        if (data.authenticated) {
          if (data.user.funcao !== 'administrador') {
            window.location.href = data.user.funcao === 'tecnico' ? '/tecnico' : '/home';
            return;
          }
          setCurrentUser(data.user);
        } else {
          window.location.href = '/';
        }
      } catch (err) {
        console.error('Erro ao verificar autenticação:', err);
        addToast('error', 'Erro de Autenticação', 'Redirecionando para login...');
        setTimeout(() => window.location.href = '/', 1000);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!currentUser) return;

    const fetchData = async () => {
      try {
        setLoading(true);
        const [chamadosRes, usuariosRes, tiposRes, apontamentosRes] = await Promise.all([
          fetch('http://localhost:8080/chamados'),
          fetch('http://localhost:8080/usuarios'),
          fetch('http://localhost:8080/pool'),
          fetch('http://localhost:8080/apontamentos')
        ]);

        const [chamadosData, usuariosData, tiposData, apontamentosData] = await Promise.all([
          chamadosRes.json(),
          usuariosRes.json(),
          tiposRes.json(),
          apontamentosRes.json()
        ]);

        setChamados(chamadosData);
        setUsuarios(usuariosData);
        setTecnicos(usuariosData.filter(u => u.funcao === 'tecnico'));
        setTipos(tiposData);
        setApontamentos(apontamentosData);
      } catch (err) {
        console.error('Erro ao carregar dados:', err);
        addToast('error', 'Erro', 'Falha ao carregar dados');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [currentUser, activeTab]);

  /* ============================
     Utility Functions
     ============================ */

  const getCreatedDate = (item) => {
    const dateStr = item.criado_em || item.created_at;
    if (!dateStr) return null;
    const date = new Date(dateStr);
    return isNaN(date.getTime()) ? null : date;
  };

  const formatDate = (dateStr) => {
    const date = getCreatedDate({ criado_em: dateStr });
    return date ? date.toLocaleDateString('pt-BR') : 'N/A';
  };

  const getUserName = (userId) => {
    const user = usuarios.find(u => u.id === userId);
    return user ? user.nome : 'N/A';
  };

  const getTipoName = (tipoId) => {
    const tipo = tipos.find(e => e.id === tipoId);
    return tipo ? tipo.titulo : 'N/A';
  };

  const getStatusBadge = (estado) => {
    const statusConfig = {
      pendente: { label: "Pendente", color: "yellow-500" },
      'em andamento': { label: "Em Andamento", color: "blue-500" },
      concluido: { label: "Concluído", color: "green-500" },
    };

    const config = statusConfig[estado] || { label: estado, color: "gray-500" };
    return <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${config.color}/20 text-${config.color}`}>{config.label}</span>;
  };

  /* ============================
     CRUD Operations - Chamados
     ============================ */

  const createChamado = async (payload) => {
    try {
      setGenericLoading(true);
      await fetch('http://localhost:8080/chamados', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedChamados = await fetch('http://localhost:8080/chamados', { credentials: 'include' }).then(res => res.json());
      setChamados(updatedChamados);
      
      setModalChamadoOpen(false);
      setEditingChamado(null);
      addToast('success', 'Sucesso', 'Chamado criado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao criar chamado', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const updateChamado = async (id, payload) => {
    try {
      setGenericLoading(true);
      await fetch(`http://localhost:8080/chamados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedChamados = await fetch('http://localhost:8080/chamados', { credentials: 'include' }).then(res => res.json());
      setChamados(updatedChamados);
      
      setModalChamadoOpen(false);
      setEditingChamado(null);
      addToast('success', 'Sucesso', 'Chamado atualizado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao atualizar chamado', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const deleteChamado = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este chamado?')) return;
    
    try {
      await fetch(`http://localhost:8080/chamados/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      setChamados(prev => prev.filter(c => c.id !== id));
      addToast('success', 'Sucesso', 'Chamado excluído com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao excluir chamado', err.message);
    }
  };

  const updateChamadoStatus = async (id, newStatus) => {
    try {
      await fetch(`http://localhost:8080/chamados/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ estado: newStatus })
      });
      setChamados(prev => prev.map(c => c.id === id ? { ...c, estado: newStatus } : c));
      addToast('success', 'Sucesso', 'Status atualizado');
    } catch (err) {
      addToast('error', 'Erro', 'Falha ao atualizar status');
    }
  };

  /* ============================
     CRUD Operations - Usuarios
     ============================ */

  const createUsuario = async (payload) => {
    try {
      setGenericLoading(true);
      await fetch('http://localhost:8080/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedUsuarios = await fetch('http://localhost:8080/usuarios', { credentials: 'include' }).then(res => res.json());
      setUsuarios(updatedUsuarios);
      setTecnicos(updatedUsuarios.filter(u => u.funcao === 'tecnico'));
      
      setModalUsuarioOpen(false);
      setEditingUsuario(null);
      addToast('success', 'Sucesso', 'Usuário criado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao criar usuário', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const updateUsuario = async (id, payload) => {
    try {
      setGenericLoading(true);
      await fetch(`http://localhost:8080/usuarios/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedUsuarios = await fetch('http://localhost:8080/usuarios', { credentials: 'include' }).then(res => res.json());
      setUsuarios(updatedUsuarios);
      setTecnicos(updatedUsuarios.filter(u => u.funcao === 'tecnico'));
      
      setModalUsuarioOpen(false);
      setEditingUsuario(null);
      addToast('success', 'Sucesso', 'Usuário atualizado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao atualizar usuário', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const deleteUsuario = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este usuário?')) return;
    
    try {
      await fetch(`http://localhost:8080/usuarios/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      setUsuarios(prev => prev.filter(u => u.id !== id));
      setTecnicos(prev => prev.filter(u => u.id !== id));
      addToast('success', 'Sucesso', 'Usuário excluído com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao excluir usuário', err.message);
    }
  };

  /* ============================
     CRUD Operations - Tipos (Pool)
     ============================ */

  const createTipo = async (payload) => {
    try {
      setGenericLoading(true);
      await fetch('http://localhost:8080/pool', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedTipos = await fetch('http://localhost:8080/pool', { credentials: 'include' }).then(res => res.json());
      setTipos(updatedTipos);
      
      setModalTipoOpen(false);
      setEditingTipo(null);
      addToast('success', 'Sucesso', 'Tipo de serviço criado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao criar tipo', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const updateTipo = async (id, payload) => {
    try {
      setGenericLoading(true);
      await fetch(`http://localhost:8080/pool/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedTipos = await fetch('http://localhost:8080/pool', { credentials: 'include' }).then(res => res.json());
      setTipos(updatedTipos);
      
      setModalTipoOpen(false);
      setEditingTipo(null);
      addToast('success', 'Sucesso', 'Tipo de serviço atualizado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao atualizar tipo', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const deleteTipo = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este tipo de serviço?')) return;
    
    try {
      await fetch(`http://localhost:8080/pool/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      setTipos(prev => prev.filter(e => e.id !== id));
      addToast('success', 'Sucesso', 'Tipo de serviço excluído com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao excluir tipo', err.message);
    }
  };

  /* ============================
     CRUD Operations - Apontamentos
     ============================ */

  const createApontamento = async (payload) => {
    try {
      setGenericLoading(true);
      await fetch('http://localhost:8080/apontamentos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedApontamentos = await fetch('http://localhost:8080/apontamentos', { credentials: 'include' }).then(res => res.json());
      setApontamentos(updatedApontamentos);
      
      setModalApontamentoOpen(false);
      setEditingApontamento(null);
      addToast('success', 'Sucesso', 'Apontamento criado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao criar apontamento', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const updateApontamento = async (id, payload) => {
    try {
      setGenericLoading(true);
      await fetch(`http://localhost:8080/apontamentos/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(payload)
      });
      
      const updatedApontamentos = await fetch('http://localhost:8080/apontamentos', { credentials: 'include' }).then(res => res.json());
      setApontamentos(updatedApontamentos);
      
      setModalApontamentoOpen(false);
      setEditingApontamento(null);
      addToast('success', 'Sucesso', 'Apontamento atualizado com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao atualizar apontamento', err.message);
    } finally {
      setGenericLoading(false);
    }
  };

  const deleteApontamento = async (id) => {
    if (!confirm('Tem certeza que deseja excluir este apontamento?')) return;
    
    try {
      await fetch(`http://localhost:8080/apontamentos/${id}`, { 
        method: 'DELETE',
        credentials: 'include'
      });
      setApontamentos(prev => prev.filter(a => a.id !== id));
      addToast('success', 'Sucesso', 'Apontamento excluído com sucesso');
    } catch (err) {
      addToast('error', 'Erro ao excluir apontamento', err.message);
    }
  };

  /* ============================
     Export Functions
     ============================ */

  const exportToPDF = (data, filename = 'relatorio') => {
    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text(filename, 14, 20);
      
      const tableData = data.map(item => [
        item.id || '',
        item.titulo || '',
        getUserName(item.usuario_id) || '',
        item.estado || '',
        formatDate(item.criado_em) || ''
      ]);

      autoTable(doc, {
        startY: 30,
        head: [['ID', 'Título', 'Solicitante', 'Status', 'Data']],
        body: tableData,
        styles: { fontSize: 10 }
      });

      doc.save(`${filename}.pdf`);
      addToast('success', 'PDF Exportado', `${filename}.pdf foi gerado com sucesso`);
    } catch (err) {
      addToast('error', 'Erro na exportação', 'Falha ao gerar PDF');
    }
  };

  const exportToExcel = (data, filename = 'relatorio') => {
    try {
      const excelData = data.map(item => ({
        ID: item.id || '',
        Título: item.titulo || '',
        Solicitante: getUserName(item.usuario_id) || '',
        Status: item.estado || '',
        Data: formatDate(item.criado_em) || '',
        Descrição: item.descricao || '',
        Patrimônio: item.patrimonio || '',
        Tipo: getTipoName(item.tipo_id) || ''
      }));

      const ws = XLSX.utils.json_to_sheet(excelData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Dados');
      XLSX.writeFile(wb, `${filename}.xlsx`);
      addToast('success', 'Excel Exportado', `${filename}.xlsx foi gerado com sucesso`);
    } catch (err) {
      addToast('error', 'Erro na exportação', 'Falha ao gerar Excel');
    }
  };

  const exportChamadoById = (id, type = 'pdf') => {
    const chamado = chamados.find(c => c.id === Number(id));
    if (!chamado) {
      addToast('error', 'Chamado não encontrado', 'Selecione um chamado válido');
      return;
    }

    const filename = `Chamado_${chamado.id}`;
    if (type === 'pdf') {
      exportToPDF([chamado], filename);
    } else {
      exportToExcel([chamado], filename);
    }
  };

  const exportChamadosRange = (range = 'week', type = 'pdf') => {
    const now = new Date();
    let startDate;
    
    if (range === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (range === 'month') {
      startDate = new Date(now.getFullYear(), now.getMonth(), 1);
    }

    const filteredChamados = chamados.filter(chamado => {
      const chamadoDate = getCreatedDate(chamado);
      return chamadoDate && chamadoDate >= startDate && chamadoDate <= now;
    });

    if (filteredChamados.length === 0) {
      addToast('error', 'Nenhum dado encontrado', `Nenhum chamado encontrado para o período: ${range}`);
      return;
    }

    const filename = `Chamados_${range}_${now.toISOString().split('T')[0]}`;
    if (type === 'pdf') {
      exportToPDF(filteredChamados, filename);
    } else {
      exportToExcel(filteredChamados, filename);
    }
  };

  /* ============================
     Filter Functions
     ============================ */

  const filteredChamados = chamados.filter(chamado => {
    const matchesSearch = searchTerm === '' || 
      chamado.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      chamado.descricao?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      getUserName(chamado.usuario_id).toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || chamado.estado === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  /* ============================
     Statistics Calculations
     ============================ */

  const stats = {
    total: chamados.length,
    pendentes: chamados.filter(c => c.estado === 'pendente').length,
    emAndamento: chamados.filter(c => c.estado === 'em andamento').length,
    concluidos: chamados.filter(c => c.estado === 'concluido').length
  };

  /* ============================
     Logout Function
     ============================ */

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', { method: 'POST', credentials: 'include' });
      router.push('/');
    } catch (err) {
      addToast('error', 'Erro', 'Falha ao fazer logout');
    }
  };

  /* ============================
     Render Component
     ============================ */

  if (loading) {
    return (
      <div className="min-h-screen bg-[#2D3250] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#E31B23] mx-auto"></div>
          <p className="mt-4 text-[#FFFDF7]">Carregando painel administrativo...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7]">
      {/* Header */}
      <header className="bg-[#1B1F3B] shadow-sm border-b border-[#FFFDF7]/10 py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <h1 className="text-3xl font-bold flex items-center space-x-3">
            <BarChart3 className="w-8 h-8 text-[#E31B23]" />
            <span>Painel Administrativo</span>
          </h1>
          <div className="flex items-center space-x-4">
            <span>
              Bem-vindo, <span className="font-semibold">{currentUser?.nome || 'Admin'}</span>
            </span>
          
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Navigation Tabs */}
        <nav className="flex space-x-4 mb-8 overflow-x-auto">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'chamados', label: 'Chamados', icon: Ticket },
            { id: 'usuarios', label: 'Usuários', icon: Users },
            { id: 'tipos', label: 'Tipos de Serviço', icon: Settings },
            { id: 'apontamentos', label: 'Apontamentos', icon: Clock },
            { id: 'relatorios', label: 'Relatórios', icon: Activity }
          ].map(tab => {
            const Icon = tab.icon;
            return (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition duration-200 whitespace-nowrap ${
                  activeTab === tab.id 
                    ? 'bg-[#E31B23]/20 text-[#E31B23] border border-[#E31B23]/30' 
                    : 'text-[#FFFDF7]/70 hover:text-[#FFFDF7] hover:bg-[#1B1F3B]'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Dashboard Tab */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard 
                title="Total de Chamados" 
                value={stats.total} 
                icon={Ticket} 
                color="bg-blue-500" 
              />
              <StatCard 
                title="Pendentes" 
                value={stats.pendentes} 
                icon={AlertCircle} 
                color="bg-[#E31B23]" 
              />
              <StatCard 
                title="Em Andamento" 
                value={stats.emAndamento} 
                icon={Clock} 
                color="bg-yellow-500" 
              />
              <StatCard 
                title="Concluídos" 
                value={stats.concluidos} 
                icon={CheckCircle} 
                color="bg-green-500" 
              />
            </div>

            <div className="bg-[#1B1F3B] rounded-xl shadow-lg border border-[#FFFDF7]/10">
              <div className="px-6 py-4 border-b border-[#FFFDF7]/10">
                <h3 className="text-lg font-semibold">Chamados Recentes</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2D3250]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Solicitante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFFDF7]/10">
                    {chamados.slice(0, 10).map(chamado => (
                      <tr key={chamado.id} className="hover:bg-[#2D3250]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{chamado.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {chamado.titulo}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getUserName(chamado.usuario_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(chamado.estado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(chamado.criado_em)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingChamado(chamado);
                                setModalChamadoOpen(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteChamado(chamado.id)}
                              className="text-[#E31B23] hover:text-[#C5161D]"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Chamados Tab */}
        {activeTab === 'chamados' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Chamados</h2>
              <button 
                onClick={() => {
                  setEditingChamado(null);
                  setModalChamadoOpen(true);
                }}
                className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Chamado</span>
              </button>
            </div>

            <div className="bg-[#1B1F3B] p-4 rounded-lg border border-[#FFFDF7]/10">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#FFFDF7]/70 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar chamados..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 p-3 rounded-lg bg-[#2D3250] text-[#FFFDF7] border border-[#2D3250] focus:border-[#E31B23] focus:outline-none"
                  />
                </div>
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full p-3 rounded-lg bg-[#2D3250] text-[#FFFDF7] border border-[#2D3250] focus:border-[#E31B23] focus:outline-none"
                >
                  <option value="">Todos os status</option>
                  <option value="pendente">Pendente</option>
                  <option value="em andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
                <div className="text-sm text-[#FFFDF7]/70 flex items-center">
                  Mostrando {filteredChamados.length} de {chamados.length} chamados
                </div>
              </div>
            </div>

            <div className="bg-[#1B1F3B] rounded-xl shadow-lg border border-[#FFFDF7]/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2D3250]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Patrimônio</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Tipo</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Status</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Solicitante</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Data</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFFDF7]/10">
                    {filteredChamados.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="px-6 py-8 text-center text-[#FFFDF7]/70">
                          Nenhum chamado encontrado
                        </td>
                      </tr>
                    ) : filteredChamados.map(chamado => (
                      <tr key={chamado.id} className="hover:bg-[#2D3250]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{chamado.id}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="max-w-xs truncate" title={chamado.titulo}>
                            {chamado.titulo}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {String(chamado.patrimonio).padStart(7, '0')}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getTipoName(chamado.tipo_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(chamado.estado)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getUserName(chamado.usuario_id)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(chamado.criado_em)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingChamado(chamado);
                                setModalChamadoOpen(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteChamado(chamado.id)}
                              className="text-[#E31B23] hover:text-[#C5161D]"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Usuarios Tab */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Usuários</h2>
              <button 
                onClick={() => {
                  setEditingUsuario(null);
                  setModalUsuarioOpen(true);
                }}
                className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Usuário</span>
              </button>
            </div>

            <div className="bg-[#1B1F3B] rounded-xl shadow-lg border border-[#FFFDF7]/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2D3250]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Nome</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Email</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Função</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Estado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFFDF7]/10">
                    {usuarios.length === 0 ? (
                      <tr>
                        <td colSpan="6" className="px-6 py-8 text-center text-[#FFFDF7]/70">
                          Nenhum usuário encontrado
                        </td>
                      </tr>
                    ) : usuarios.map(usuario => (
                      <tr key={usuario.id} className="hover:bg-[#2D3250]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{usuario.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {usuario.nome}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {usuario.email}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            usuario.funcao === 'administrador' ? 'bg-purple-500/20 text-purple-400' :
                            usuario.funcao === 'tecnico' ? 'bg-blue-500/20 text-blue-400' :
                            'bg-gray-500/20 text-gray-400'
                          }`}>
                            {usuario.funcao}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            usuario.estado === 'ativo' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                          }`}>
                            {usuario.estado}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingUsuario(usuario);
                                setModalUsuarioOpen(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteUsuario(usuario.id)}
                              className="text-[#E31B23] hover:text-[#C5161D]"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Tipos de Serviço Tab */}
        {activeTab === 'tipos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Tipos de Serviço</h2>
      
            </div>

            <div className="bg-[#1B1F3B] rounded-xl shadow-lg border border-[#FFFDF7]/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2D3250]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Título</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFFDF7]/10">
                    {tipos.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="px-6 py-8 text-center text-[#FFFDF7]/70">
                          Nenhum tipo de serviço encontrado
                        </td>
                      </tr>
                    ) : tipos.map(tipo => (
                      <tr key={tipo.id} className="hover:bg-[#2D3250]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{tipo.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {tipo.titulo}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          {tipo.descricao}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingTipo(tipo);
                                setModalTipoOpen(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteTipo(tipo.id)}
                              className="text-[#E31B23] hover:text-[#C5161D]"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Apontamentos Tab */}
        {activeTab === 'apontamentos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gerenciar Apontamentos</h2>
              <button 
                onClick={() => {
                  setEditingApontamento(null);
                  setModalApontamentoOpen(true);
                }}
                className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200 flex items-center space-x-2"
              >
                <Plus className="w-5 h-5" />
                <span>Novo Apontamento</span>
              </button>
            </div>

            <div className="bg-[#1B1F3B] rounded-xl shadow-lg border border-[#FFFDF7]/10">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-[#2D3250]">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">ID</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Chamado</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Técnico</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Descrição</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Início</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Fim</th>
                      <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#FFFDF7]/10">
                    {apontamentos.length === 0 ? (
                      <tr>
                        <td colSpan="7" className="px-6 py-8 text-center text-[#FFFDF7]/70">
                          Nenhum apontamento encontrado
                        </td>
                      </tr>
                    ) : apontamentos.map(apontamento => (
                      <tr key={apontamento.id} className="hover:bg-[#2D3250]">
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          #{apontamento.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          #{apontamento.chamado_id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {getUserName(apontamento.tecnico_id)}
                        </td>
                        <td className="px-6 py-4 text-sm">
                          <div className="max-w-xs truncate" title={apontamento.descricao}>
                            {apontamento.descricao}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(apontamento.comeco)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {formatDate(apontamento.fim)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setEditingApontamento(apontamento);
                                setModalApontamentoOpen(true);
                              }}
                              className="text-blue-400 hover:text-blue-300"
                              title="Editar"
                            >
                              <Edit className="w-4 h-4" />
                            </button>
                            <button 
                              onClick={() => deleteApontamento(apontamento.id)}
                              className="text-[#E31B23] hover:text-[#C5161D]"
                              title="Excluir"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Relatorios Tab */}
        {activeTab === 'relatorios' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold">Relatórios</h2>
            <div className="bg-[#1B1F3B] rounded-xl shadow-lg border border-[#FFFDF7]/10 p-6">
              <h3 className="text-lg font-semibold mb-4">Exportar Chamado Individual</h3>
              <ExportChamadoForm chamados={chamados} onExport={exportChamadoById} />
              <h3 className="text-lg font-semibold mt-8 mb-4">Exportar Chamados por Período</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button 
                  onClick={() => exportChamadosRange('week', 'pdf')} 
                  className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200"
                >
                  Exportar Semana (PDF)
                </button>
                <button 
                  onClick={() => exportChamadosRange('week', 'excel')} 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Exportar Semana (Excel)
                </button>
                <button 
                  onClick={() => exportChamadosRange('month', 'pdf')} 
                  className="bg-[#E31B23] text-white px-4 py-2 rounded-lg hover:bg-[#C5161D] transition duration-200"
                >
                  Exportar Mês (PDF)
                </button>
                <button 
                  onClick={() => exportChamadosRange('month', 'excel')} 
                  className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition duration-200"
                >
                  Exportar Mês (Excel)
                </button>
              </div>
            </div>
          </div>
        )}
      </main>

      <ChamadoModal 
        isOpen={modalChamadoOpen}
        onClose={() => setModalChamadoOpen(false)}
        onSubmit={(data) => editingChamado ? updateChamado(editingChamado.id, data) : createChamado(data)}
        initial={editingChamado}
        tipos={tipos}
        usuarios={usuarios}
        tecnicos={tecnicos}
        loading={genericLoading}
      />
      <UsuarioModal 
        isOpen={modalUsuarioOpen}
        onClose={() => setModalUsuarioOpen(false)}
        onSubmit={(data) => editingUsuario ? updateUsuario(editingUsuario.id, data) : createUsuario(data)}
        initial={editingUsuario}
        isEditing={!!editingUsuario}
        loading={genericLoading}
      />
      <TipoModal 
        isOpen={modalTipoOpen}
        onClose={() => setModalTipoOpen(false)}
        onSubmit={(data) => editingTipo ? updateTipo(editingTipo.id, data) : createTipo(data)}
        initial={editingTipo}
        loading={genericLoading}
      />
      <ApontamentoModal 
        isOpen={modalApontamentoOpen}
        onClose={() => setModalApontamentoOpen(false)}
        onSubmit={(data) => editingApontamento ? updateApontamento(editingApontamento.id, data) : createApontamento(data)}
        initial={editingApontamento}
        chamados={chamados}
        tecnicos={tecnicos}
        loading={genericLoading}
      />
      <Toasts toasts={toasts} removeToast={removeToast} />
    </div>
  );
};