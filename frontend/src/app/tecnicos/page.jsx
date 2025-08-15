'use client';

import { useState, useEffect } from "react";

const statusOptions = [
  { value: "pendente", label: "Pendente", color: "yellow" },
  { value: "em_andamento", label: "Em Andamento", color: "blue" },
  { value: "concluido", label: "Concluído", color: "green" },
  { value: "cancelado", label: "Cancelado", color: "red" }
];

export default function PainelTecnico() {
  const [tickets, setTickets] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [apontamentos, setApontamentos] = useState([]);
  const [newStatus, setNewStatus] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState(null);
  
  // ID do técnico logado (em um sistema real, viria da autenticação)
  const tecnicoLogadoId = 3; // Temporário - substituir pela autenticação real

  // Buscar dados iniciais
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        
        const [chamadosRes, tiposRes, tecnicosRes] = await Promise.all([
          fetch("http://localhost:8080/chamados"),
          fetch("http://localhost:8080/pool"),
          fetch("http://localhost:8080/usuarios")
        ]);

        const [chamadosData, tiposData, tecnicosData] = await Promise.all([
          chamadosRes.json(),
          tiposRes.json(),
          tecnicosRes.json()
        ]);

        // Filtrar apenas chamados do técnico logado
        const chamadosDoTecnico = chamadosData.filter(
          chamado => chamado.tecnico_id === tecnicoLogadoId
        );

        setTickets(chamadosDoTecnico);
        setTipos(tiposData);
        setTecnicos(tecnicosData.filter(user => user.funcao === 'tecnico'));
        
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
        setError("Erro ao carregar dados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

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

  // Função para obter nome do tipo pelo ID
  const getTipoNome = (tipoId) => {
    const tipo = tipos.find(t => t.id === tipoId);
    return tipo ? tipo.titulo.charAt(0).toUpperCase() + tipo.titulo.slice(1) : "Tipo não encontrado";
  };

  // Função para obter nome do técnico pelo ID
  const getTecnicoNome = (tecnicoId) => {
    const tecnico = tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? tecnico.nome : "Técnico não encontrado";
  };

  // Atualizar status do chamado
  const atualizarStatusChamado = async (chamadoId, novoStatus) => {
    try {
      const chamado = tickets.find(t => t.id === chamadoId);
      if (!chamado) return;

      const payload = {
        titulo: chamado.titulo,
        patrimonio: chamado.patrimonio,
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
        throw new Error("Erro ao atualizar status");
      }

      // Atualizar estado local
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === chamadoId 
            ? { ...ticket, estado: novoStatus }
            : ticket
        )
      );

      return true;
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
      throw error;
    }
  };

  // Criar novo apontamento
  const criarApontamento = async (chamadoId, descricao) => {
    try {
      const agora = new Date().toISOString();
      
      const payload = {
        chamado_id: chamadoId,
        tecnico_id: tecnicoLogadoId,
        descricao: descricao,
        comeco: agora,
        fim: agora // Em um sistema real, isso seria controlado separadamente
      };

      const response = await fetch("http://localhost:8080/apontamentos", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Erro ao criar apontamento");
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
      
      // Atualizar status se foi alterado
      if (newStatus && newStatus !== selectedTicket.estado) {
        await atualizarStatusChamado(selectedTicket.id, newStatus);
      }
      
      // Criar apontamento se foi adicionado
      if (newNote.trim()) {
        await criarApontamento(selectedTicket.id, newNote.trim());
        
        // Recarregar apontamentos
        const response = await fetch("http://localhost:8080/apontamentos");
        const data = await response.json();
        const apontamentosDoTicket = data.filter(
          apontamento => apontamento.chamado_id === selectedTicket.id
        );
        setApontamentos(apontamentosDoTicket);
      }
      
      // Fechar modal e limpar campos
      setShowManageModal(false);
      setNewStatus("");
      setNewNote("");
      
      // Mostrar sucesso (opcional)
      alert("Alterações salvas com sucesso!");
      
    } catch (err) {
      console.error("Erro ao atualizar chamado:", err);
      setError("Erro ao salvar alterações. Tente novamente.");
    } finally {
      setIsSaving(false);
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
        statusInfo.color === "red" ? "bg-red-500/20 text-red-400" :
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
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-3xl sm:text-4xl font-bold mb-6">Painel do Técnico</h1>
          <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-[#FFFDF7]/90">
            Gerencie seus chamados, atualize status e registre apontamentos
          </p>
          <button
            onClick={() => window.history.back()}
            className="text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300"
          >
            Voltar para a Página Inicial
          </button>
        </div>
      </header>

      {/* Conteúdo Principal */}
      <main className="py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {error && (
            <div className="bg-red-500/20 text-red-500 p-4 rounded-lg mb-6">
              {error}
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
                          <p className="text-[#FFFDF7]/70">Data:</p>
                          <p className="text-[#FFFDF7]">
                            {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
                          </p>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => {
                          setSelectedTicket(ticket);
                          setNewStatus(ticket.estado || "pendente");
                          setShowManageModal(true);
                        }}
                        className="w-full bg-[#E31B23] hover:bg-[#C5161D] text-white py-2 rounded-lg font-medium transition duration-300"
                      >
                        Gerenciar Chamado
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
                        <th className="p-4 text-left">Status</th>
                        <th className="p-4 text-left">Data</th>
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
                          <td className="p-4">
                            <StatusBadge status={ticket.estado} />
                          </td>
                          <td className="p-4">
                            {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
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

      {/* Modal de Gerenciamento */}
      {showManageModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-[#2D3250] rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-hidden">
            <div className="p-6">
              <h3 className="text-xl font-bold text-[#FFFDF7] mb-4">
                Gerenciar Chamado #{selectedTicket.id}
              </h3>
              
              <div className="mb-4 p-4 bg-[#1B1F3B] rounded-lg">
                <h4 className="font-semibold text-[#FFFDF7] mb-2">Detalhes do Chamado</h4>
                <p className="text-[#FFFDF7]/90 text-sm"><strong>Título:</strong> {selectedTicket.titulo}</p>
                <p className="text-[#FFFDF7]/90 text-sm"><strong>Descrição:</strong> {selectedTicket.descricao}</p>
                <p className="text-[#FFFDF7]/90 text-sm"><strong>Patrimônio:</strong> {selectedTicket.patrimonio}</p>
              </div>

              {/* Apontamentos Existentes */}
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#FFFDF7] mb-3">Apontamentos Registrados</h4>
                <div className="bg-[#1B1F3B] rounded-lg p-4 max-h-40 overflow-y-auto">
                  {apontamentos.length > 0 ? (
                    <ul className="space-y-3">
                      {apontamentos.map((apontamento, index) => (
                        <li key={apontamento.id || index} className="text-[#FFFDF7]/90 text-sm border-b border-[#FFFDF7]/10 pb-2 last:border-0">
                          <p><strong>Técnico:</strong> {getTecnicoNome(apontamento.tecnico_id)}</p>
                          <p><strong>Descrição:</strong> {apontamento.descricao}</p>
                          <p><strong>Data:</strong> {new Date(apontamento.comeco).toLocaleString("pt-BR")}</p>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-[#FFFDF7]/70 text-sm">Nenhum apontamento registrado ainda.</p>
                  )}
                </div>
              </div>
              
              {/* Formulário de Atualização */}
              <div onSubmit={handleUpdateTicket}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#FFFDF7] mb-2">
                    Status do Chamado
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
                    Novo Apontamento (opcional)
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:border-[#E31B23] focus:outline-none"
                    rows={4}
                    placeholder="Descreva as ações realizadas, problemas encontrados, soluções aplicadas..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowManageModal(false)}
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg font-medium hover:bg-[#FFFDF7]/30 transition duration-300"
                  >
                    Cancelar
                  </button>
                  <button
                    type="button"
                    onClick={handleUpdateTicket}
                    className="bg-[#E31B23] hover:bg-[#C5161D] text-white px-4 py-2 rounded-lg font-medium transition duration-300"
                    disabled={isSaving}
                  >
                    {isSaving ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}