'use client';

import { useState, useEffect, useRef } from 'react';
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
  Eye,
  CheckCircle,
  Clock,
  AlertCircle,
  Activity
} from 'lucide-react';

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import * as XLSX from 'xlsx';

/* ============================
   Helpers / UI small pieces
   ============================ */

const BASE = 'http://localhost:8080';

async function apiRequest(path, opts = {}) {
  const url = `${BASE}${path}`;
  const headers = opts.headers || {};
  if (!headers['Content-Type'] && !(opts.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }
  const res = await fetch(url, {
    credentials: 'include',
    ...opts,
    headers
  });
  if (!res.ok) {
    const text = await res.text().catch(() => '');
    let message = res.statusText || 'Erro na requisição';
    try {
      const json = JSON.parse(text);
      message = json.mensagem || json.message || JSON.stringify(json);
    } catch { /* ignore */ }
    throw new Error(message || `HTTP ${res.status}`);
  }
  if (res.status === 204) return null;
  return res.json().catch(() => null);
}

const StatCard = ({ title, value, icon: Icon, change, color }) => (
  <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
    <div className="flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-black">{title}</p>
        <p className="text-2xl font-bold text-black mt-1">{value}</p>
        {change !== undefined && (
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

/* ============================
   Toasts
   ============================ */

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
            <p className="text-sm font-semibold text-black">{t.title}</p>
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
   Modais (Chamado, Usuario, Equip)
   - Inputs styled to match page bg (bg-gray-50)
   - Font colors set to black where appropriate
   ============================ */

// ChamadoModal
function ChamadoModal({ isOpen, onClose, onSubmit, initial = null, tipos = [], usuarios = [], loading }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({
    titulo: '',
    descricao: '',
    patrimonio: '',
    tipo_id: '',
    tecnico_id: '',
    usuario_id: '',
    estado: 'aberto',
    prioridade: 'media'
  });

  useEffect(() => {
    if (initial) {
      setForm({
        titulo: initial.titulo || '',
        descricao: initial.descricao || '',
        patrimonio: initial.patrimonio ? String(initial.patrimonio).padStart(7, '0') : '',
        tipo_id: initial.tipo_id || '',
        tecnico_id: initial.tecnico_id || '',
        usuario_id: initial.usuario_id || '',
        estado: initial.estado || 'aberto',
        prioridade: initial.prioridade || 'media'
      });
    } else {
      setForm({
        titulo: '',
        descricao: '',
        patrimonio: '',
        tipo_id: '',
        tecnico_id: '',
        usuario_id: '',
        estado: 'aberto',
        prioridade: 'media'
      });
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-black px-3 py-2 rounded-lg";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
        <h2 className="text-xl font-bold mb-4 text-black">{isEditing ? 'Editar Chamado' : 'Novo Chamado'}</h2>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Título</label>
            <input required value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Descrição</label>
            <textarea required value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})}
              className={inputClass} rows={3}/>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Patrimônio (7 dígitos)</label>
              <input required maxLength={7} value={form.patrimonio} onChange={(e) => setForm({...form, patrimonio: e.target.value})}
                className={inputClass} placeholder="0000001" />
            </div>

            <div>
              <label className="block text-sm font-medium text-black">Tipo</label>
              <select required value={form.tipo_id} onChange={(e) => setForm({...form, tipo_id: e.target.value})}
                className={inputClass}>
                <option value="">Selecione</option>
                {tipos.map(t => <option key={t.id} value={t.id}>{t.titulo}</option>)}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Técnico</label>
              <select value={form.tecnico_id || ''} onChange={(e) => setForm({...form, tecnico_id: e.target.value})}
                className={inputClass}>
                <option value="">Sem técnico</option>
                {usuarios.filter(u => u.funcao === 'tecnico').map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Solicitante</label>
              <select required value={form.usuario_id} onChange={(e) => setForm({...form, usuario_id: e.target.value})}
                className={inputClass}>
                <option value="">Selecione</option>
                {usuarios.map(u => <option key={u.id} value={u.id}>{u.nome}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Estado</label>
              <select value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})}
                className={inputClass}>
                <option value="aberto">Aberto</option>
                <option value="em_andamento">Em Andamento</option>
                <option value="concluido">Concluído</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Prioridade</label>
            <select value={form.prioridade} onChange={(e) => setForm({...form, prioridade: e.target.value})}
              className={inputClass}>
              <option value="baixa">Baixa</option>
              <option value="media">Média</option>
              <option value="alta">Alta</option>
            </select>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// UsuarioModal
function UsuarioModal({ isOpen, onClose, onSubmit, initial = null, isEditing = false, loading }) {
  const [form, setForm] = useState({ nome: '', email: '', senha: '', funcao: 'usuario', estado: 'ativo' });

  useEffect(() => {
    if (initial) {
      setForm({
        nome: initial.nome || '',
        email: initial.email || '',
        senha: '',
        funcao: initial.funcao || 'usuario',
        estado: initial.estado || 'ativo'
      });
    } else {
      setForm({ nome: '', email: '', senha: '', funcao: 'usuario', estado: 'ativo' });
    }
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-black px-3 py-2 rounded-lg";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black">{isEditing ? 'Editar Usuário' : 'Novo Usuário'}</h2>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Nome</label>
            <input required value={form.nome} onChange={(e) => setForm({...form, nome: e.target.value})}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Email</label>
            <input required type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">{isEditing ? 'Nova senha (opcional)' : 'Senha'}</label>
            <input type="password" value={form.senha} onChange={(e) => setForm({...form, senha: e.target.value})}
              className={inputClass} required={!isEditing} />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-black">Função</label>
              <select value={form.funcao} onChange={(e) => setForm({...form, funcao: e.target.value})}
                className={inputClass}>
                <option value="usuario">Usuário</option>
                <option value="tecnico">Técnico</option>
                <option value="administrador">Administrador</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-black">Estado</label>
              <select value={form.estado} onChange={(e) => setForm({...form, estado: e.target.value})}
                className={inputClass}>
                <option value="ativo">Ativo</option>
                <option value="inativo">Inativo</option>
              </select>
            </div>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-green-600 text-white px-4 py-2 rounded-lg">
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// EquipamentoModal
function EquipamentoModal({ isOpen, onClose, onSubmit, initial = null, loading }) {
  const isEditing = !!initial;
  const [form, setForm] = useState({ titulo: '', descricao: '' });

  useEffect(() => {
    if (initial) setForm({ titulo: initial.titulo || '', descricao: initial.descricao || '' });
    else setForm({ titulo: '', descricao: '' });
  }, [initial, isOpen]);

  if (!isOpen) return null;

  const inputClass = "w-full bg-gray-50 border border-gray-200 text-black px-3 py-2 rounded-lg";

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl w-full max-w-md p-6">
        <h2 className="text-xl font-bold mb-4 text-black">{isEditing ? 'Editar Tipo' : 'Novo Tipo'}</h2>

        <form onSubmit={(e) => { e.preventDefault(); onSubmit(form); }} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-black">Título</label>
            <input required value={form.titulo} onChange={(e) => setForm({...form, titulo: e.target.value})}
              className={inputClass} />
          </div>

          <div>
            <label className="block text-sm font-medium text-black">Descrição</label>
            <textarea required value={form.descricao} onChange={(e) => setForm({...form, descricao: e.target.value})}
              className={inputClass} rows={3}/>
          </div>

          <div className="flex justify-end space-x-3 pt-4">
            <button type="button" onClick={onClose} className="bg-gray-200 px-4 py-2 rounded-lg">Cancelar</button>
            <button type="submit" disabled={loading} className="bg-blue-600 text-white px-4 py-2 rounded-lg">
              {loading ? 'Salvando...' : (isEditing ? 'Atualizar' : 'Criar')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

/* ============================
   AdminPage Principal
   ============================ */

export default function AdminPage() {
  const router = useRouter();

  const [activeTab, setActiveTab] = useState('dashboard');

  // dados
  const [chamados, setChamados] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [equipamentos, setEquipamentos] = useState([]);

  // estados UI
  const [loading, setLoading] = useState(false);
  const [modalChamadoOpen, setModalChamadoOpen] = useState(false);
  const [modalUsuarioOpen, setModalUsuarioOpen] = useState(false);
  const [modalEquipOpen, setModalEquipOpen] = useState(false);

  const [editingChamado, setEditingChamado] = useState(null);
  const [editingUsuario, setEditingUsuario] = useState(null);
  const [editingEquip, setEditingEquip] = useState(null);

  const [genericLoading, setGenericLoading] = useState(false);

  // Toasts
  const [toasts, setToasts] = useState([]);
  const toastTimerRef = useRef({});

  const addToast = (type, title, message, duration = 3500) => {
    const id = Date.now().toString(36) + Math.random().toString(36).slice(2,6);
    setToasts(prev => [...prev, { id, type, title, message }]);
    // auto remove
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

  /* fetch inicial */
  useEffect(() => {
    const fetchAll = async () => {
      try {
        setLoading(true);
        const [ch, us, eq] = await Promise.all([
          apiRequest('/chamados'),
          apiRequest('/usuarios'),
          apiRequest('/pool'),
        ]);
        setChamados(Array.isArray(ch) ? ch : []);
        setUsuarios(Array.isArray(us) ? us : []);
        setEquipamentos(Array.isArray(eq) ? eq : []);
      } catch (err) {
        addToast('error','Erro', err.message || 'Erro ao carregar dados');
      } finally {
        setLoading(false);
      }
    };
    // check auth (basic)
    (async () => {
      try {
        const auth = await apiRequest('/auth/check-auth');
        if (!auth || !auth.authenticated) return router.push('/');
        if (auth.user.funcao !== 'administrador') {
          return router.push(auth.user.funcao === 'tecnico' ? '/tecnico' : '/home');
        }
      } catch {
        router.push('/');
      }
    })();

    fetchAll();
  }, [router]);

  /* ===================
     auxiliares
     =================== */
  const getCreatedDate = (t) => {
    const s = t.criado_em || t.created_at || t.criadoEm || t.createdAt || t.created;
    if (!s) return null;
    const d = new Date(s);
    return isNaN(d) ? null : d;
  };

  /* ===================
     CRUD Chamados
     =================== */
  const createChamado = async (payload) => {
    try {
      setGenericLoading(true);
      const body = {
        ...payload,
        patrimonio: Number(String(payload.patrimonio || '').replace(/\D/g,'')),
        tipo_id: payload.tipo_id ? Number(payload.tipo_id) : null,
        tecnico_id: payload.tecnico_id ? Number(payload.tecnico_id) : null,
        usuario_id: payload.usuario_id ? Number(payload.usuario_id) : null,
        estado: payload.estado || 'aberto',
        prioridade: payload.prioridade || 'media'
      };
      const res = await apiRequest('/chamados', { method: 'POST', body: JSON.stringify(body) });
      setChamados(prev => [res, ...prev]);
      setModalChamadoOpen(false);
      setEditingChamado(null);
      addToast('success','Chamado criado','Chamado criado com sucesso');
    } catch (err) {
      addToast('error','Erro ao criar', err.message);
    } finally { setGenericLoading(false); }
  };

  const updateChamado = async (id, payload) => {
    try {
      setGenericLoading(true);
      const atual = await apiRequest(`/chamados/${id}`);
      const body = {
        titulo: payload.titulo ?? atual.titulo,
        patrimonio: Number(String(payload.patrimonio || atual.patrimonio || '').replace(/\D/g,'')),
        descricao: payload.descricao ?? atual.descricao,
        tipo_id: payload.tipo_id ? Number(payload.tipo_id) : atual.tipo_id,
        tecnico_id: payload.tecnico_id ? Number(payload.tecnico_id) : atual.tecnico_id,
        usuario_id: payload.usuario_id ? Number(payload.usuario_id) : atual.usuario_id,
        estado: payload.estado ?? atual.estado
      };
      const res = await apiRequest(`/chamados/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      setChamados(prev => prev.map(c => c.id === id ? res : c));
      setModalChamadoOpen(false);
      setEditingChamado(null);
      addToast('success','Chamado atualizado','Alterações salvas com sucesso');
    } catch (err) {
      addToast('error','Erro ao atualizar', err.message);
    } finally { setGenericLoading(false); }
  };

  const deleteChamado = async (id) => {
    if (!confirm('Confirmar exclusão do chamado?')) return;
    try {
      await apiRequest(`/chamados/${id}`, { method: 'DELETE' });
      setChamados(prev => prev.filter(c => c.id !== id));
      addToast('success','Chamado excluído','Chamado removido com sucesso');
    } catch (err) {
      addToast('error','Erro ao excluir', err.message);
    }
  };

  const changeChamadoEstado = async (id, novoEstado) => {
    try {
      setGenericLoading(true);
      const atual = await apiRequest(`/chamados/${id}`);
      const payload = {
        titulo: atual.titulo,
        patrimonio: atual.patrimonio,
        descricao: atual.descricao,
        tipo_id: atual.tipo_id,
        tecnico_id: atual.tecnico_id,
        usuario_id: atual.usuario_id,
        estado: novoEstado
      };
      const res = await apiRequest(`/chamados/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setChamados(prev => prev.map(c => c.id === id ? res : c));
      addToast('success','Estado atualizado', `Status alterado para "${novoEstado}"`);
    } catch (err) {
      addToast('error','Erro ao atualizar', err.message);
    } finally { setGenericLoading(false); }
  };

  const changeChamadoPrioridade = async (id, novaPrioridade) => {
    try {
      const atual = await apiRequest(`/chamados/${id}`);
      const payload = { ...atual, prioridade: novaPrioridade };
      const res = await apiRequest(`/chamados/${id}`, { method: 'PUT', body: JSON.stringify(payload) });
      setChamados(prev => prev.map(c => c.id === id ? res : c));
      addToast('success','Prioridade atualizada', `Prioridade: ${novaPrioridade}`);
    } catch (err) {
      addToast('error','Erro ao atualizar', err.message);
    }
  };

  /* ===================
     CRUD Usuarios
     =================== */
  const createUsuario = async (payload) => {
    try {
      setGenericLoading(true);
      const body = {
        nome: payload.nome,
        email: payload.email,
        senha: payload.senha,
        funcao: payload.funcao || 'usuario',
        estado: payload.estado || 'ativo'
      };
      const res = await apiRequest('/usuarios', { method: 'POST', body: JSON.stringify(body) });
      setUsuarios(prev => [res, ...prev]);
      setModalUsuarioOpen(false);
      setEditingUsuario(null);
      addToast('success','Usuário criado','Usuário criado com sucesso');
    } catch (err) {
      addToast('error','Erro ao criar', err.message);
    } finally { setGenericLoading(false); }
  };

  const updateUsuario = async (id, payload) => {
    try {
      setGenericLoading(true);
      const body = {
        nome: payload.nome,
        email: payload.email,
        ...(payload.senha ? { senha: payload.senha } : {}),
        funcao: payload.funcao,
        estado: payload.estado
      };
      const res = await apiRequest(`/usuarios/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      setUsuarios(prev => prev.map(u => u.id === id ? res : u));
      setModalUsuarioOpen(false);
      setEditingUsuario(null);
      addToast('success','Usuário atualizado','Alterações salvas');
    } catch (err) {
      addToast('error','Erro ao atualizar', err.message);
    } finally { setGenericLoading(false); }
  };

  const deleteUsuario = async (id) => {
    if (!confirm('Confirmar exclusão do usuário?')) return;
    try {
      await apiRequest(`/usuarios/${id}`, { method: 'DELETE' });
      setUsuarios(prev => prev.filter(u => u.id !== id));
      addToast('success','Usuário excluído','Usuário removido com sucesso');
    } catch (err) {
      addToast('error','Erro ao excluir', err.message);
    }
  };

  /* ===================
     CRUD Equipamentos (pool)
     =================== */
  const createEquip = async (payload) => {
    try {
      setGenericLoading(true);
      const body = { titulo: payload.titulo, descricao: payload.descricao, created_by: 1, updated_by: 1 };
      const res = await apiRequest('/pool', { method: 'POST', body: JSON.stringify(body) });
      setEquipamentos(prev => [res, ...prev]);
      setModalEquipOpen(false);
      setEditingEquip(null);
      addToast('success','Tipo criado','Tipo de serviço criado com sucesso');
    } catch (err) {
      addToast('error','Erro ao criar', err.message);
    } finally { setGenericLoading(false); }
  };

  const updateEquip = async (id, payload) => {
    try {
      setGenericLoading(true);
      const body = { titulo: payload.titulo, descricao: payload.descricao, updated_by: 1 };
      const res = await apiRequest(`/pool/${id}`, { method: 'PUT', body: JSON.stringify(body) });
      setEquipamentos(prev => prev.map(e => e.id === id ? res : e));
      setModalEquipOpen(false);
      setEditingEquip(null);
      addToast('success','Tipo atualizado','Alterações salvas');
    } catch (err) {
      addToast('error','Erro ao atualizar', err.message);
    } finally { setGenericLoading(false); }
  };

  const deleteEquip = async (id) => {
    if (!confirm('Confirmar exclusão do tipo?')) return;
    try {
      await apiRequest(`/pool/${id}`, { method: 'DELETE' });
      setEquipamentos(prev => prev.filter(e => e.id !== id));
      addToast('success','Tipo excluído','Tipo removido com sucesso');
    } catch (err) {
      addToast('error','Erro ao excluir', err.message);
    }
  };

  /* ===================
     Export (PDF / Excel)
     =================== */

  const exportToPDF = (rows, filename = 'relatorio') => {
    const doc = new jsPDF();
    doc.setFontSize(14);
    doc.text(filename, 14, 16);
    const body = rows.map(r => [
      r.id,
      r.titulo,
      (usuarios.find(u => u.id === r.usuario_id)?.nome) || r.usuario_id || 'N/A',
      r.estado || r.estado,
      (getCreatedDate(r) ? getCreatedDate(r).toLocaleDateString('pt-BR') : 'N/A')
    ]);
    autoTable(doc, {
      startY: 22,
      head: [['ID','Título','Usuário','Status','Data']],
      body
    });
    doc.save(`${filename}.pdf`);
    addToast('success','Exportado PDF', `${filename}.pdf gerado`);
  };

  const exportToExcel = (rows, filename = 'relatorio') => {
    const data = rows.map(r => ({
      ID: r.id,
      Título: r.titulo,
      Usuário: usuarios.find(u => u.id === r.usuario_id)?.nome || r.usuario_id || 'N/A',
      Estado: r.estado,
      Data: getCreatedDate(r) ? getCreatedDate(r).toLocaleDateString('pt-BR') : ''
    }));
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Relatorio');
    XLSX.writeFile(wb, `${filename}.xlsx`);
    addToast('success','Exportado Excel', `${filename}.xlsx gerado`);
  };

  const exportChamadoById = (id, type = 'pdf') => {
    const item = chamados.find(c => String(c.id) === String(id));
    if (!item) return addToast('error','Chamado não encontrado','Escolha um ID válido');
    if (type === 'pdf') exportToPDF([item], `Chamado_${item.id}`);
    else exportToExcel([item], `Chamado_${item.id}`);
  };

  const exportChamadosRange = (range = 'week', type = 'pdf') => {
    const now = new Date();
    let start;
    if (range === 'week') {
      start = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else {
      start = new Date(now.getFullYear(), now.getMonth(), 1);
    }
    const filtered = chamados.filter(c => {
      const d = getCreatedDate(c);
      return d && d >= start && d <= now;
    });
    if (filtered.length === 0) return addToast('error','Nenhum chamado','Nenhum chamado no período');
    if (type === 'pdf') exportToPDF(filtered, `Chamados_${range}`);
    else exportToExcel(filtered, `Chamados_${range}`);
  };

  /* ===================
     UI Render
     =================== */

  const inputClassMain = "w-full bg-gray-50 border border-gray-200 text-black px-3 py-2 rounded-lg";

  return (
    <div className="min-h-screen bg-gray-50 text-black">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <h1 className="text-3xl font-bold text-black flex items-center space-x-3">
              <BarChart3 className="w-6 h-6" />
              <span>Painel Administrativo</span>
            </h1>
            <div className="flex items-center space-x-4">
              <span className="text-black">Admin</span>
              <button onClick={() => { apiRequest('/auth/logout', { method: 'POST' }).catch(()=>{}); router.push('/'); }}
                className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition duration-200">
                Sair
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Tabs */}
        <nav className="flex space-x-4 mb-8">
          {[
            { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
            { id: 'chamados', label: 'Chamados', icon: Ticket },
            { id: 'usuarios', label: 'Usuários', icon: Users },
            { id: 'equipamentos', label: 'Tipos', icon: Settings },
            { id: 'relatorios', label: 'Relatórios', icon: Activity }
          ].map(t => {
            const Icon = t.icon;
            return (
              <button key={t.id} onClick={() => setActiveTab(t.id)}
                className={`flex items-center space-x-2 px-3 py-2 rounded-lg transition duration-200 ${activeTab === t.id ? 'bg-blue-100 text-blue-700' : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'}`}>
                <Icon className="w-5 h-5" />
                <span>{t.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Error messages replaced by toasts */}
        {/* TAB: dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Chamados" value={chamados.length} icon={Ticket} change={12} color="bg-blue-500" />
              <StatCard title="Abertos" value={chamados.filter(c => c.estado === 'aberto').length} icon={AlertCircle} change={-5} color="bg-red-500" />
              <StatCard title="Em Andamento" value={chamados.filter(c => c.estado === 'em_andamento').length} icon={Clock} change={8} color="bg-yellow-500" />
              <StatCard title="Concluídos" value={chamados.filter(c => c.estado === 'concluido').length} icon={CheckCircle} change={15} color="bg-green-500" />
            </div>

            <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100">
              <h3 className="text-lg font-semibold text-black mb-4">Chamados Recentes</h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left">ID</th>
                      <th className="px-4 py-2 text-left">Título</th>
                      <th className="px-4 py-2 text-left">Solicitante</th>
                      <th className="px-4 py-2 text-left">Estado</th>
                      <th className="px-4 py-2 text-left">Data</th>
                      <th className="px-4 py-2 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {chamados.slice(0,5).map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-4 py-2">#{c.id}</td>
                        <td className="px-4 py-2">{c.titulo}</td>
                        <td className="px-4 py-2">{usuarios.find(u=>u.id===c.usuario_id)?.nome || 'N/A'}</td>
                        <td className="px-4 py-2">{c.estado}</td>
                        <td className="px-4 py-2">{getCreatedDate(c)?.toLocaleDateString('pt-BR') || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingChamado(c); setModalChamadoOpen(true); }} className="text-green-600 p-1"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => deleteChamado(c.id)} className="text-red-600 p-1"><Trash2 className="w-4 h-4"/></button>
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

        {/* TAB: chamados */}
        {activeTab === 'chamados' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Gerenciar Chamados</h2>
              <button onClick={() => { setEditingChamado(null); setModalChamadoOpen(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="w-5 h-5"/> Novo Chamado
              </button>
            </div>

            <div className="bg-white p-4 rounded-lg">
              <div className="flex gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"/>
                  <input placeholder="Buscar..." className={`${inputClassMain} pl-10`} />
                </div>
                <select className={inputClassMain}>
                  <option value="">Todos</option>
                  <option value="aberto">Aberto</option>
                  <option value="em_andamento">Em Andamento</option>
                  <option value="concluido">Concluído</option>
                </select>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">Chamados</h3>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Título</th>
                      <th className="px-6 py-3 text-left">Patrimônio</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                      <th className="px-6 py-3 text-left">Prioridade</th>
                      <th className="px-6 py-3 text-left">Data</th>
                      <th className="px-6 py-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {loading ? (
                      <tr><td colSpan="7" className="p-6 text-center">Carregando...</td></tr>
                    ) : chamados.length === 0 ? (
                      <tr><td colSpan="7" className="p-6 text-center text-gray-500">Nenhum chamado</td></tr>
                    ) : chamados.map(c => (
                      <tr key={c.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">#{c.id}</td>
                        <td className="px-6 py-4">{c.titulo}</td>
                        <td className="px-6 py-4">{c.patrimonio}</td>
                        <td className="px-6 py-4">
                          <select value={c.estado} onChange={(e) => changeChamadoEstado(c.id, e.target.value)}
                            className="px-2 py-1 rounded-full text-xs bg-gray-50 border border-gray-200">
                            <option value="aberto">Aberto</option>
                            <option value="em_andamento">Em Andamento</option>
                            <option value="concluido">Concluído</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">
                          <select value={c.prioridade || 'media'} onChange={(e) => changeChamadoPrioridade(c.id, e.target.value)}
                            className="px-2 py-1 rounded-full text-xs bg-gray-50 border border-gray-200">
                            <option value="baixa">Baixa</option>
                            <option value="media">Média</option>
                            <option value="alta">Alta</option>
                          </select>
                        </td>
                        <td className="px-6 py-4">{getCreatedDate(c)?.toLocaleDateString('pt-BR') || 'N/A'}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingChamado(c); setModalChamadoOpen(true); }} className="text-green-600"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => deleteChamado(c.id)} className="text-red-600"><Trash2 className="w-4 h-4"/></button>
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

        {/* TAB: usuarios */}
        {activeTab === 'usuarios' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Gerenciar Usuários</h2>
              <button onClick={() => { setEditingUsuario(null); setModalUsuarioOpen(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="w-5 h-5"/> Novo Usuário
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">Usuários</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Nome</th>
                      <th className="px-6 py-3 text-left">Email</th>
                      <th className="px-6 py-3 text-left">Função</th>
                      <th className="px-6 py-3 text-left">Estado</th>
                      <th className="px-6 py-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {usuarios.length === 0 ? (
                      <tr><td colSpan="6" className="p-6 text-center text-gray-500">Nenhum usuário</td></tr>
                    ) : usuarios.map(u => (
                      <tr key={u.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">#{u.id}</td>
                        <td className="px-6 py-4">{u.nome}</td>
                        <td className="px-6 py-4">{u.email}</td>
                        <td className="px-6 py-4">{u.funcao}</td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex px-2 py-1 rounded-full text-xs ${u.estado === 'ativo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>{u.estado}</span>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingUsuario(u); setModalUsuarioOpen(true); }} className="text-green-600"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => deleteUsuario(u.id)} className="text-red-600"><Trash2 className="w-4 h-4"/></button>
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

        {/* TAB: equipamentos */}
        {activeTab === 'equipamentos' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold text-black">Gerenciar Tipos</h2>
              <button onClick={() => { setEditingEquip(null); setModalEquipOpen(true); }}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                <Plus className="w-5 h-5"/> Novo Tipo
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-black">Tipos de Serviço</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left">ID</th>
                      <th className="px-6 py-3 text-left">Título</th>
                      <th className="px-6 py-3 text-left">Descrição</th>
                      <th className="px-6 py-3 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {equipamentos.length === 0 ? (
                      <tr><td colSpan="4" className="p-6 text-center text-gray-500">Nenhum tipo</td></tr>
                    ) : equipamentos.map(e => (
                      <tr key={e.id} className="hover:bg-gray-50">
                        <td className="px-6 py-4">#{e.id}</td>
                        <td className="px-6 py-4">{e.titulo}</td>
                        <td className="px-6 py-4">{e.descricao}</td>
                        <td className="px-6 py-4">
                          <div className="flex gap-2">
                            <button onClick={() => { setEditingEquip(e); setModalEquipOpen(true); }} className="text-green-600"><Edit className="w-4 h-4"/></button>
                            <button onClick={() => deleteEquip(e.id)} className="text-red-600"><Trash2 className="w-4 h-4"/></button>
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

        {/* TAB: relatórios */}
        {activeTab === 'relatorios' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-black">Relatórios</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-xl shadow border">
                <h3 className="font-semibold mb-3 text-black">Exportar Chamado específico</h3>
                <ExportChamadoForm onExport={(id, type) => exportChamadoById(id, type)} chamados={chamados} />
              </div>

              <div className="bg-white p-6 rounded-xl shadow border">
                <h3 className="font-semibold mb-3 text-black">Exportar por período</h3>
                <div className="flex gap-3">
                  <button onClick={() => exportChamadosRange('week','pdf')} className="bg-blue-600 text-white px-4 py-2 rounded">PDF - Última Semana</button>
                  <button onClick={() => exportChamadosRange('week','excel')} className="bg-green-600 text-white px-4 py-2 rounded">Excel - Última Semana</button>
                  <button onClick={() => exportChamadosRange('month','pdf')} className="bg-blue-600 text-white px-4 py-2 rounded">PDF - Mês</button>
                  <button onClick={() => exportChamadosRange('month','excel')} className="bg-green-600 text-white px-4 py-2 rounded">Excel - Mês</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Modais */}
        <ChamadoModal
          isOpen={modalChamadoOpen}
          onClose={() => { setModalChamadoOpen(false); setEditingChamado(null); }}
          onSubmit={async (data) => {
            try {
              if (editingChamado) await updateChamado(editingChamado.id, data);
              else await createChamado(data);
            } catch (err) { addToast('error','Erro', err.message); }
          }}
          initial={editingChamado}
          tipos={equipamentos}
          usuarios={usuarios}
          loading={genericLoading}
        />

        <UsuarioModal
          isOpen={modalUsuarioOpen}
          onClose={() => { setModalUsuarioOpen(false); setEditingUsuario(null); }}
          initial={editingUsuario}
          isEditing={!!editingUsuario}
          onSubmit={async (data) => {
            try {
              if (editingUsuario) await updateUsuario(editingUsuario.id, data);
              else await createUsuario(data);
            } catch (err) { addToast('error','Erro', err.message); }
          }}
          loading={genericLoading}
        />

        <EquipamentoModal
          isOpen={modalEquipOpen}
          onClose={() => { setModalEquipOpen(false); setEditingEquip(null); }}
          initial={editingEquip}
          onSubmit={async (data) => {
            try {
              if (editingEquip) await updateEquip(editingEquip.id, data);
              else await createEquip(data);
            } catch (err) { addToast('error','Erro', err.message); }
          }}
          loading={genericLoading}
        />

        {/* Toasts */}
        <Toasts toasts={toasts} removeToast={removeToast} />
      </main>
    </div>
  );
}

/* ============================
   Pequeno componente auxiliar
   ExportChamadoForm (select id + botões)
   ============================ */
function ExportChamadoForm({ chamados, onExport }) {
  const [selectedId, setSelectedId] = useState('');
  const inputClass = "w-full bg-gray-50 border border-gray-200 text-black px-3 py-2 rounded";
  return (
    <div className="space-y-3">
      <select className={inputClass} value={selectedId} onChange={(e) => setSelectedId(e.target.value)}>
        <option value="">Selecione um Chamado (por ID)</option>
        {chamados.map(c => <option key={c.id} value={c.id}>#{c.id} — {c.titulo}</option>)}
      </select>

      <div className="flex gap-2">
        <button onClick={() => {
          if (!selectedId) return alert('Escolha um chamado');
          onExport(selectedId, 'pdf');
        }} className="bg-blue-600 text-white px-4 py-2 rounded">PDF</button>

        <button onClick={() => {
          if (!selectedId) return alert('Escolha um chamado');
          onExport(selectedId, 'excel');
        }} className="bg-green-600 text-white px-4 py-2 rounded">Excel</button>
      </div>
    </div>
  );
}
