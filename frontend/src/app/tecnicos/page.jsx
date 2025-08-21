'use client';

import { useState, useEffect } from "react";

const statusOptions = [
  { value: "pendente", label: "Pendente", color: "yellow" },
  { value: "em andamento", label: "Em Andamento", color: "blue" },
  { value: "concluido", label: "Concluído", color: "green" },
];

export default function PainelTecnico() {
  const [tickets, setTickets] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [usuarios, setUsuarios] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [apontamentos, setApontamentos] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [tecnicoLogadoId, setTecnicoLogadoId] = useState(null);

  // Verificar autenticação e obter ID do técnico logado
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/check-auth", {
          credentials: "include", // Incluir cookies
        });
        const data = await response.json();
        if (data.authenticated) {
          if (data.user.funcao !== "tecnico") {
            // Redirecionar se não for técnico
            window.location.href = data.user.funcao === "administrador" ? "/admin" : "/home";
            return;
          }
          setTecnicoLogadoId(data.user.id);
        } else {
          window.location.href = "/"; // Redirecionar para login se não autenticado
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
        setError("Erro ao verificar autenticação. Tente novamente.");
        window.location.href = "/";
      }
    };
    checkAuth();
  }, []);

  // Buscar dados iniciais apenas após obter o ID do técnico
  useEffect(() => {
    if (!tecnicoLogadoId) return;

    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [chamadosRes, tiposRes, tecnicosRes, usuariosRes] = await Promise.all([
          fetch("http://localhost:8080/chamados"),
          fetch("http://localhost:8080/pool"),
          fetch("http://localhost:8080/usuarios"),
          fetch("http://localhost:8080/usuarios")
        ]);

        if (!chamadosRes.ok || !tiposRes.ok || !tecnicosRes.ok || !usuariosRes.ok) {
          throw new Error("Erro ao buscar dados do servidor.");
        }

        const [chamadosData, tiposData, tecnicosData, usuariosData] = await Promise.all([
          chamadosRes.json(),
          tiposRes.json(),
          tecnicosRes.json(),
          usuariosRes.json()
        ]);

        // Filtrar apenas chamados do técnico logado
        const chamadosDoTecnico = chamadosData.filter(
          chamado => chamado.tecnico_id === tecnicoLogadoId
        );

        setTickets(chamadosDoTecnico);
        setTipos(tiposData);
        setTecnicos(tecnicosData.filter(user => user.funcao === 'tecnico'));
        setUsuarios(usuariosData);
        
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        if (err.message.includes("Failed to fetch")) {
          setError("Não foi possível conectar ao servidor. Verifique sua conexão ou tente novamente mais tarde.");
        } else {
          setError(`Erro ao carregar dados: ${err.message}`);
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [tecnicoLogadoId]);

  // Buscar apontamentos quando modal abrir
  useEffect(() => {
    if (showManageModal && selectedTicket) {
      const fetchApontamentos = async () => {
        try {
          const response = await fetch("http://localhost:8080/apontamentos");
          const data = await response.json();
          
          // Filtrar apontamentos do chamado selecionado
          const apontamentosDoTicket = data.filter(
            apontamento => apontamento.chamado_id === selectedTicket.id
          );
          
          setApontamentos(apontamentosDoTicket);
        } catch (err) {
          console.error("Erro ao buscar apontamentos:", err);
          setApontamentos([]);
        }
      };

      fetchApontamentos();
    }
  }, [showManageModal, selectedTicket]);

  // Limpar mensagens de sucesso após 3 segundos
  useEffect(() => {
    if (successMessage) {
      const timer = setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [successMessage]);

  // Função para obter nome do tipo pelo ID
  const getTipoNome = (tipoId) => {
    const tipo = tipos.find(t => t.id === tipoId);
    return tipo ? tipo.titulo.charAt(0).toUpperCase() + tipo.titulo.slice(1).replace('_', ' ') : "Tipo não encontrado";
  };

  // Função para obter nome do técnico pelo ID
  const getTecnicoNome = (tecnicoId) => {
    const tecnico = tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? tecnico.nome : "Técnico não encontrado";
  };

  // Função para obter nome do usuário pelo ID
  const getUsuarioNome = (usuarioId) => {
    const usuario = usuarios.find(u => u.id === usuarioId);
    return usuario ? usuario.nome : "Usuário não encontrado";
  };

  // Atualizar apenas o status do chamado
  const atualizarApenasStatus = async (chamadoId, novoStatus) => {
    try {
      const chamado = tickets.find(t => t.id === chamadoId);
      if (!chamado) throw new Error("Chamado não encontrado");

      const payload = {
        titulo: chamado.titulo,
        patrimonio: String(chamado.patrimonio).padStart(7, '0'),
        descricao: chamado.descricao,
        tipo_id: chamado.tipo_id,
        tecnico_id: chamado.tecnico_id,
        usuario_id: chamado.usuario_id,
        estado: novoStatus
      };

      const response = await fetch(`http://localhost:8080/chamados/${chamadoId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || "Erro ao atualizar status");
      }

      // Atualizar estado local
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === chamadoId 
            ? { ...ticket, estado: novoStatus }
            : ticket
        )
      );

      if (selectedTicket && selectedTicket.id === chamadoId) {
        setSelectedTicket(prev => ({ ...prev, estado: novoStatus }));
      }

      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    }
  };

  // Criar novo apontamento
  const criarApontamento = async (chamadoId, descricao) => {
    try {
      const agora = new Date();
      const inicioTrabalho = new Date(agora.getTime() - (30 * 60 * 1000)); // Exemplo: 30 min atrás
      
      const payload = {
        chamado_id: chamadoId,
        tecnico_id: tecnicoLogadoId,
        descricao: descricao,
        comeco: inicioTrabalho.toISOString().slice(0, 19).replace('T', ' '),
        fim: agora.toISOString().slice(0, 19).replace('T', ' ')
      };

      const response = await fetch("http://localhost:8080/apontamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.mensagem || "Erro ao criar apontamento");
      }

      return true;
    } catch (error) {
      console.error("Erro ao criar apontamento:", error);
      throw error;
    }
  };

  // Gerenciar chamado (atualizar status e/ou adicionar apontamento)
  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    
    if (!selectedTicket) return;

    try {
      setIsSaving(true);
      setError(null);
      
      let statusAtualizado = false;
      let apontamentoCriado = false;

      if (newStatus && newStatus !== selectedTicket.estado) {
        await atualizarApenasStatus(selectedTicket.id, newStatus);
        statusAtualizado = true;
      }
      
      if (newNote.trim()) {
        await criarApontamento(selectedTicket.id, newNote.trim());
        apontamentoCriado = true;
        
        // Recarregar apontamentos
        const response = await fetch("http://localhost:8080/apontamentos");
        const data = await response.json();
        const apontamentosDoTicket = data.filter(
          apontamento => apontamento.chamado_id === selectedTicket.id
        );
        setApontamentos(apontamentosDoTicket);
      }
      
      setShowManageModal(false);
      setNewStatus("");
      setNewNote("");
      
      let mensagem = "Alterações salvas com sucesso!";
      if (statusAtualizado && apontamentoCriado) {
        mensagem = "Status atualizado e apontamento registrado com sucesso!";
      } else if (statusAtualizado) {
        mensagem = "Status do chamado atualizado com sucesso!";
      } else if (apontamentoCriado) {
        mensagem = "Apontamento registrado com sucesso!";
      }
      
      setSuccessMessage(mensagem);
      
    } catch (err) {
      setError(`Erro ao salvar alterações: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  // Quick status update (botão rápido na listagem)
  const quickStatusUpdate = async (ticketId, novoStatus) => {
    try {
      setError(null);
      await atualizarApenasStatus(ticketId, novoStatus);
      setSuccessMessage(`Status alterado para "${statusOptions.find(s => s.value === novoStatus)?.label}" com sucesso!`);
    } catch (err) {
      setError(`Erro ao atualizar status: ${err.message}`);
    }
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      setError("Erro ao fazer logout. Tente novamente.");
    }
  };

  // Status badge com cor correspondente
  const StatusBadge = ({ status }) => {
    const statusInfo = statusOptions.find(opt => opt.value === status) || 
                      { label: status, color: "gray" };
    
    return (
      <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
        statusInfo.color === "yellow" ? "bg-yellow-500/20 text-yellow-400" :
        statusInfo.color === "blue" ? "bg-blue-500/20 text-blue-400" :
        statusInfo.color === "green" ? "bg-green-500/20 text-green-400" :
        "bg-gray-500/20 text-gray-400"
      }`}>
        {statusInfo.label}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-sans">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-12 px-4">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Painel do Técnico</h1>
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-[#FFFDF7]/90">
            Gerencie seus chamados, atualize status e registre apontamentos
          </p>
          <div className="flex gap-4">
            <button
              onClick={() => window.history.back()}
              className="text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300"
            >
              Voltar para a Página Inicial
            </button>
            <button
              onClick={handleLogout}
              className="bg-[#E31B23] hover:bg-[#C5161D] text-[#FFFDF7] px-4 py-2 rounded-lg font-medium transition duration-300"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Mensagens de Feedback */}
          {error && (
            <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6 border border-red-500/30">
              <strong>Erro:</strong> {error}
            </div>
          )}

          {successMessage && (
            <div className="bg-green-500/20 text-green-500 p-4 rounded-lg mb-6 border border-green-500/30">
              <strong>Sucesso:</strong> {successMessage}
            </div>
          )}

          <div className="bg-[#2D3250] rounded-xl shadow-lg border-t-4 border-[#E31B23] p-6">
            <h2 className="text-2xl font-bold text-[#FFFDF7] mb-6">
              Meus Chamados ({tickets.length})
            </h2>
            
            {isLoading ? (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E31B23]"></div>
              </div>
            ) : tickets.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-[#FFFDF7]/80 text-lg mb-4">Nenhum chamado atribuído no momento.</p>
                <p className="text-[#FFFDF7]/60 text-sm">
                  Aguarde novos chamados serem atribuídos a você pelo sistema.
                </p>
              </div>
            ) : (
              <>
                {/* Versão Mobile */}
                <div className="lg:hidden space-y-4">
                  {tickets.map(ticket => (
                    <div key={ticket.id} className="bg-[#1B1F3B] p-4 rounded-lg">
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="font-bold text-[#FFFDF7]">#{ticket.id} - {ticket.titulo}</h3>
                        <StatusBadge status={ticket.estado} />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-3 text-sm mb-4">
                        <div>
                          <p className="text-[#FFFDF7]/70">Patrimônio:</p>
                          <p className="text-[#FFFDF7]">{ticket.patrimonio || "N/A"}</p>
                        </div>
                        <div>
                          <p className="text-[#FFFDF7]/70">Tipo:</p>
                          <p className="text-[#FFFDF7]">{getTipoNome(ticket.tipo_id)}</p>
                        </div>
                        <div className="col-span-2">
                          <p className="text-[#FFFDF7]/70">Descrição:</p>
                          <p className="text-[#FFFDF7] text-sm">{ticket.descricao}</p>
                        </div>
                        <div>
                          <p className="text-[#FFFDF7]/70">Solicitante:</p>
                          <p className="text-[#FFFDF7]">{getUsuarioNome(ticket.usuario_id)}</p>
                        </div>
                        <div>
                          <p className="text-[#FFFDF7]/70">Data:</p>
                          <p className="text-[#FFFDF7]">
                            {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
                          </p>
                        </div>
                      </div>

                      {/* Atualização rápida de status no mobile */}
                      <select
                        onChange={(e) => quickStatusUpdate(ticket.id, e.target.value)}
                        value={ticket.estado}
                        className="w-full mb-2 p-2 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:border-[#E31B23] focus:outline-none"
                      >
                        {statusOptions.map(option => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                      
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setNewStatus(ticket.estado || "pendente");
                          setShowManageModal(true);
                        }}
                        className="w-full bg-[#E31B23] hover:bg-[#C5161D] text-white py-2 rounded-lg font-medium transition duration-300"
                      >
                        Gerenciar Detalhado
                      </button>
                    </div>
                  ))}
                </div>
                
                {/* Versão Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-[#FFFDF7]">
                    <thead>
                      <tr className="bg-[#1B1F3B]">
                        <th className="p-4 text-left">ID</th>
                        <th className="p-4 text-left">Título</th>
                        <th className="p-4 text-left">Patrimônio</th>
                        <th className="p-4 text-left">Tipo</th>
                        <th className="p-4 text-left">Solicitante</th>
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Data</th>
                        <th className="p-4 text-left">Atualizar Status</th>
                        <th className="p-4 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(ticket => (
                        <tr key={ticket.id} className="border-b border-[#1B1F3B] hover:bg-[#1B1F3B]/50">
                          <td className="p-4">#{ticket.id}</td>
                          <td className="p-4">{ticket.titulo}</td>
                          <td className="p-4">{ticket.patrimonio || "N/A"}</td>
                          <td className="p-4">{getTipoNome(ticket.tipo_id)}</td>
                          <td className="p-4">{getUsuarioNome(ticket.usuario_id)}</td>
                          <td className="p-4">
                            <StatusBadge status={ticket.estado} />
                          </td>
                          <td className="p-4">
                            {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
                          </td>
                          <td className="p-4">
                            <select
                              onChange={(e) => quickStatusUpdate(ticket.id, e.target.value)}
                              value={ticket.estado}
                              className="bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg p-1 focus:border-[#E31B23] focus:outline-none"
                            >
                              {statusOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setNewStatus(ticket.estado || "pendente");
                                setShowManageModal(true);
                              }}
                              className="text-[#E31B23] hover:text-[#C5161D] font-medium transition duration-300"
                            >
                              Gerenciar
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de Gerenciamento Detalhado */}
      {showManageModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D3250] rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#FFFDF7] mb-4">
                Gerenciar Chamado #{selectedTicket.id}
              </h3>
              
              <div className="mb-6 p-4 bg-[#1B1F3B] rounded-lg">
                <h4 className="font-semibold text-[#FFFDF7] mb-2">Detalhes do Chamado</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
                  <p className="text-[#FFFDF7]/90"><strong>Título:</strong> {selectedTicket.titulo}</p>
                  <p className="text-[#FFFDF7]/90"><strong>Patrimônio:</strong> {selectedTicket.patrimonio}</p>
                  <p className="text-[#FFFDF7]/90"><strong>Tipo:</strong> {getTipoNome(selectedTicket.tipo_id)}</p>
                  <p className="text-[#FFFDF7]/90"><strong>Solicitante:</strong> {getUsuarioNome(selectedTicket.usuario_id)}</p>
                  <p className="text-[#FFFDF7]/90 md:col-span-2"><strong>Descrição:</strong> {selectedTicket.descricao}</p>
                  <p className="text-[#FFFDF7]/90"><strong>Data de Criação:</strong> {new Date(selectedTicket.criado_em).toLocaleString("pt-BR")}</p>
                  <p className="text-[#FFFDF7]/90"><strong>Status Atual:</strong> 
                    <span className="ml-2">
                      <StatusBadge status={selectedTicket.estado} />
                    </span>
                  </p>
                </div>
              </div>

              {/* Apontamentos Existentes */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#FFFDF7] mb-3">Histórico de Apontamentos</h4>
                <div className="bg-[#1B1F3B] rounded-lg p-4 max-h-40 overflow-y-auto">
                  {apontamentos.length > 0 ? (
                    <ul className="space-y-3">
                      {apontamentos.map((apontamento, index) => (
                        <li key={apontamento.id || index} className="text-[#FFFDF7]/90 text-sm border-b border-[#FFFDF7]/10 pb-2 last:border-0">
                          <div className="flex justify-between items-start mb-1">
                            <p><strong>Técnico:</strong> {getTecnicoNome(apontamento.tecnico_id)}</p>
                            <p className="text-xs text-[#FFFDF7]/70">
                              {new Date(apontamento.comeco).toLocaleString("pt-BR")}
                            </p>
                          </div>
                          <p><strong>Descrição:</strong> {apontamento.descricao}</p>
                          {apontamento.duracao && (
                            <p className="text-xs text-[#FFFDF7]/70">
                              <strong>Duração:</strong> {Math.round(apontamento.duracao / 60)} min
                            </p>
                          )}
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#FFFDF7]/70 text-sm text-center py-4">
                      Nenhum apontamento registrado ainda.
                    </p>
                  )}
                </div>
              </div>
              
              {/* Formulário de Atualização */}
              <form onSubmit={handleUpdateTicket}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#FFFDF7] mb-2">
                    Alterar Status do Chamado
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:border-[#E31B23] focus:outline-none"
                  >
                    {statusOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                
                <div className="mb-6">
                  <label className="block text-sm font-medium text-[#FFFDF7] mb-2">
                    Registrar Novo Apontamento
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:border-[#E31B23] focus:outline-none"
                    rows={4}
                    placeholder="Descreva detalhadamente as ações realizadas, problemas encontrados, soluções aplicadas, materiais utilizados, tempo gasto, etc..."
                  />
                  <p className="text-xs text-[#FFFDF7]/60 mt-1">
                    Este apontamento será registrado com data/hora atual
                  </p>
                </div>
                
                {error && (
                  <div className="mb-4 p-3 bg-red-500/20 text-red-400 text-sm rounded-lg border border-red-500/30">
                    {error}
                  </div>
                )}
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManageModal(false);
                      setNewStatus("");
                      setNewNote("");
                      setError(null);
                    }}
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-6 py-2 rounded-lg font-medium hover:bg-[#FFFDF7]/30 transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#E31B23] hover:bg-[#C5161D] text-white px-6 py-2 rounded-lg font-medium transition duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                    disabled={isSaving || (!newNote.trim() && newStatus === selectedTicket.estado)}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}