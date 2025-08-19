'use client';

import { useState, useEffect } from "react";

export default function MeusChamados() {
  const [tickets, setTickets] = useState([]);
  const [tipos, setTipos] = useState([]);
  const [tecnicos, setTecnicos] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [apontamentos, setApontamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadingApontamentos, setLoadingApontamentos] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);

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

        setTickets(chamadosData);
        setTipos(tiposData);
        setTecnicos(tecnicosData.filter(user => user.funcao === 'tecnico'));
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (showNotesModal && selectedTicket) {
      const fetchApontamentos = async () => {
        try {
          setLoadingApontamentos(true);
          const response = await fetch("http://localhost:8080/apontamentos");
          const data = await response.json();

          const apontamentosFiltrados = data.filter(
            apontamento => apontamento.chamado_id === selectedTicket.id
          );

          setApontamentos(apontamentosFiltrados);
        } catch (err) {
          console.error("Erro ao buscar apontamentos:", err);
          setApontamentos([]);
        } finally {
          setLoadingApontamentos(false);
        }
      };

      fetchApontamentos();
    }
  }, [showNotesModal, selectedTicket]);

  const getTipoNome = (tipoId) => {
    const tipo = tipos.find(t => t.id === tipoId);
    return tipo ? tipo.titulo.charAt(0).toUpperCase() + tipo.titulo.slice(1) : "Tipo não encontrado";
  };

  const getTecnicoNome = (tecnicoId) => {
    const tecnico = tecnicos.find(t => t.id === tecnicoId);
    return tecnico ? tecnico.nome : "Técnico não encontrado";
  };

  // === Ajuste de Status ===
  const getStatusBadge = (estado) => {
    if (!estado) return null;

    const statusKey = estado.toLowerCase().replace(/\s+/g, "_");
    // transforma "em andamento" → "em_andamento"

    const statusConfig = {
      pendente: { label: "Pendente", classes: "bg-yellow-500/20 text-yellow-400" },
      em_andamento: { label: "Em Andamento", classes: "bg-blue-600/20 text-blue-500" },
      concluido: { label: "Concluído", classes: "bg-green-500/20 text-green-400" },
      cancelado: { label: "Cancelado", classes: "bg-red-500/20 text-red-400" }
    };

    const config = statusConfig[statusKey] || { label: estado, classes: "bg-gray-500/20 text-gray-400" };

 return (
  <span
    className={`px-2 py-1 rounded-full text-xs md:text-sm font-medium whitespace-nowrap ${config.classes}`}
  >
    {config.label}
  </span>
  
);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] font-sans flex items-center justify-center">
        <div className="text-[#1B1F3B] text-xl">Carregando chamados...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFFDF7] font-sans">
      {/* Cabeçalho */}
      <header className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Meus Chamados
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto text-[#FFFDF7]/90">
            Acompanhe o status dos seus chamados e visualize os relatórios dos técnicos
          </p>
          <button
            onClick={() => window.history.back()}
            className="inline-block text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300 text-sm sm:text-base"
          >
            Voltar para a Página Inicial
          </button>
        </div>
      </header>

      {/* Lista de chamados */}
      <main className="py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="bg-[#2D3250] p-4 sm:p-6 rounded-xl shadow-lg border-t-4 border-[#E31B23]">
            <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFFDF7] mb-4 sm:mb-6">
              Chamados Registrados ({tickets.length})
            </h2>

            {tickets.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-[#FFFDF7]/70 text-lg mb-4">Nenhum chamado encontrado</p>
                <button
                  onClick={() => window.location.href = '/novo-chamado'}
                  className="bg-[#E31B23] text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition duration-300"
                >
                  Abrir Primeiro Chamado
                </button>
              </div>
            ) : (
              <>
                {/* Tabela Desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-[#FFFDF7]">
                    <thead>
                      <tr className="bg-[#1B1F3B]">
                        <th className="p-3 text-left">ID</th>
                        <th className="p-3 text-left">Título</th>
                        <th className="p-3 text-left">Nº Patrimônio</th>
                        <th className="p-3 text-left">Descrição</th>
                        <th className="p-3 text-left">Tipo</th>
                        <th className="p-3 text-left">Status</th>
                        <th className="p-3 text-left">Técnico</th>
                        <th className="p-3 text-left">Data</th>
                        <th className="p-3 text-left">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => {
                        const numeroPatrimonio = ticket.patrimonio
                          ? String(ticket.patrimonio).padStart(7, "0")
                          : "N/A";
                        const descricaoText = ticket.descricao || "Sem descrição";

                        return (
                          <tr key={ticket.id} className="border-b border-[#1B1F3B] hover:bg-[#1B1F3B]/50">
                            <td className="p-3">{ticket.id}</td>
                            <td className="p-3">{ticket.titulo}</td>
                            <td className="p-3">{numeroPatrimonio}</td>
                            <td className="p-3 max-w-xs truncate">{descricaoText}</td>
                            <td className="p-3">{getTipoNome(ticket.tipo_id)}</td>
                            <td className="p-3">{getStatusBadge(ticket.estado)}</td>
                            <td className="p-3">{getTecnicoNome(ticket.tecnico_id)}</td>
                            <td className="p-3">{ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}</td>
                            <td className="p-3">
                              <button
                                className="text-[#E31B23] hover:text-[#C5161D]"
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setShowNotesModal(true);
                                }}
                              >
                                Relatórios
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {/* Versão Mobile */}
                <div className="lg:hidden space-y-4">
                  {tickets.map((ticket) => {
                    const numeroPatrimonio = ticket.patrimonio
                      ? String(ticket.patrimonio).padStart(7, "0")
                      : "N/A";
                    const descricaoText = ticket.descricao || "Sem descrição";

                    return (
                      <div key={ticket.id} className="bg-[#1B1F3B] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-[#FFFDF7]">{ticket.titulo}</h3>
                          <span className="text-xs text-[#FFFDF7]/70">ID: {ticket.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs mb-3">
                          <div>
                            <p className="text-[#FFFDF7]/70">Patrimônio:</p>
                            <p className="text-[#FFFDF7]">{numeroPatrimonio}</p>
                          </div>
                          <div>
                            <p className="text-[#FFFDF7]/70">Tipo:</p>
                            <p className="text-[#FFFDF7]">{getTipoNome(ticket.tipo_id)}</p>
                          </div>
                          <div>
                            <p className="text-[#FFFDF7]/70">Status:</p>
                            {getStatusBadge(ticket.estado)}
                          </div>
                          <div>
                            <p className="text-[#FFFDF7]/70">Técnico:</p>
                            <p className="text-[#FFFDF7]">{getTecnicoNome(ticket.tecnico_id)}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-[#FFFDF7]/70 text-xs">Descrição:</p>
                          <p className="text-[#FFFDF7] text-xs line-clamp-2">{descricaoText}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-[#FFFDF7]/70 text-xs">
                            {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
                          </p>
                          <button
                            className="text-[#E31B23] hover:text-[#C5161D] text-xs"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowNotesModal(true);
                            }}
                          >
                            Ver Relatórios
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </div>
      </main>

      {/* Modal de apontamentos */}
      {showNotesModal && selectedTicket && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
          <div className="bg-[#2D3250] p-4 sm:p-6 rounded-xl shadow-lg max-w-md w-full mx-4 max-h-[80vh] overflow-hidden">
            <h3 className="text-lg font-bold text-[#FFFDF7] mb-3">
              Relatórios do Chamado #{selectedTicket.id}
            </h3>
            <div className="mb-4">
              <p className="text-[#FFFDF7]/70 text-sm">
                <strong>Técnico Responsável:</strong> {getTecnicoNome(selectedTicket.tecnico_id)}
              </p>
              <p className="text-[#FFFDF7]/70 text-sm">
                <strong>Status:</strong> {getStatusBadge(selectedTicket.estado)}
              </p>
            </div>

            <div className="mb-4 max-h-48 overflow-y-auto">
              {loadingApontamentos ? (
                <p className="text-[#FFFDF7]/90 text-xs">Carregando apontamentos...</p>
              ) : apontamentos.length > 0 ? (
                <ul className="space-y-3">
                  {apontamentos.map((apontamento, index) => (
                    <li key={apontamento.id || index} className="text-[#FFFDF7]/90 text-xs border-b border-[#FFFDF7]/10 pb-3">
                      <p><strong>Técnico:</strong> {getTecnicoNome(apontamento.tecnico_id)}</p>
                      <p><strong>Descrição:</strong> {apontamento.descricao}</p>
                      {apontamento.comeco && (
                        <p><strong>Início:</strong> {new Date(apontamento.comeco).toLocaleString("pt-BR")}</p>
                      )}
                      {apontamento.fim && (
                        <p><strong>Fim:</strong> {new Date(apontamento.fim).toLocaleString("pt-BR")}</p>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-[#FFFDF7]/90 text-xs">Nenhum relatório registrado ainda.</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-3 py-1 rounded-lg font-bold hover:bg-[#FFFDF7]/30 text-sm"
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
