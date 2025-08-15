'use client';

import { useState, useEffect } from "react";

export default function MeusChamados() {
  // Estado para armazenar os chamados
  const [tickets, setTickets] = useState([]);
  // Estado para armazenar tipos de serviço
  const [tipos, setTipos] = useState([]);
  // Estado para armazenar técnicos
  const [tecnicos, setTecnicos] = useState([]);
  // Estado para controlar exibição do modal de apontamentos
  const [showNotesModal, setShowNotesModal] = useState(false);
  // Chamado selecionado para visualizar relatórios
  const [selectedTicket, setSelectedTicket] = useState(null);
  // Estado para armazenar apontamentos do chamado
  const [apontamentos, setApontamentos] = useState([]);
  // Estados de loading
  const [loading, setLoading] = useState(true);
  const [loadingApontamentos, setLoadingApontamentos] = useState(false);

  // Função para buscar todos os dados necessários
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Buscar chamados, tipos e técnicos em paralelo
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
        // Filtrar apenas os técnicos
        setTecnicos(tecnicosData.filter(user => user.funcao === 'tecnico'));
        
      } catch (err) {
        console.error("Erro ao buscar dados:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Efeito para buscar apontamentos quando o modal é aberto
  useEffect(() => {
    if (showNotesModal && selectedTicket) {
      const fetchApontamentos = async () => {
        try {
          setLoadingApontamentos(true);
          const response = await fetch("http://localhost:8080/apontamentos");
          const data = await response.json();
          
          // Filtrar apontamentos pelo chamado selecionado
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

  // Função para obter status formatado
  const getStatusFormatado = (estado) => {
    const statusMap = {
      'pendente': 'Pendente',
      'em_andamento': 'Em Andamento', 
      'concluido': 'Concluído',
      'cancelado': 'Cancelado'
    };
    return statusMap[estado] || estado;
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
      {/* Cabeçalho da página */}
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
                {/* Tabela para desktop */}
                <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-[#FFFDF7]">
                    <thead>
                      <tr className="bg-[#1B1F3B]">
                        <th className="p-3 text-left text-sm md:text-base">ID</th>
                        <th className="p-3 text-left text-sm md:text-base">Título</th>
                        <th className="p-3 text-left text-sm md:text-base">Nº Patrimônio</th>
                        <th className="p-3 text-left text-sm md:text-base">Descrição</th>
                        <th className="p-3 text-left text-sm md:text-base">Tipo</th>
                        <th className="p-3 text-left text-sm md:text-base">Status</th>
                        <th className="p-3 text-left text-sm md:text-base">Técnico</th>
                        <th className="p-3 text-left text-sm md:text-base">Data</th>
                        <th className="p-3 text-left text-sm md:text-base">Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map((ticket) => {
                        // Formata o patrimônio com zeros à esquerda (7 dígitos)
                        const numeroPatrimonio = ticket.patrimonio
                          ? String(ticket.patrimonio).padStart(7, "0")
                          : "N/A";

                        const descricaoText = ticket.descricao || "Sem descrição";

                        return (
                          <tr
                            key={ticket.id}
                            className="border-b border-[#1B1F3B] hover:bg-[#1B1F3B]/50"
                          >
                            <td className="p-3 text-sm md:text-base">{ticket.id}</td>
                            <td className="p-3 text-sm md:text-base">{ticket.titulo}</td>
                            <td className="p-3 text-sm md:text-base">{numeroPatrimonio}</td>
                            <td className="p-3 text-sm md:text-base max-w-xs truncate">{descricaoText}</td>
                            <td className="p-3 text-sm md:text-base">{getTipoNome(ticket.tipo_id)}</td>
                            <td className="p-3 text-sm md:text-base">
                              <span
                                className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                                  ticket.estado === "pendente"
                                    ? "bg-yellow-500/20 text-yellow-400"
                                    : ticket.estado === "em_andamento"
                                    ? "bg-blue-500/20 text-blue-400"
                                    : ticket.estado === "concluido"
                                    ? "bg-green-500/20 text-green-400"
                                    : "bg-red-500/20 text-red-400"
                                }`}
                              >
                                {getStatusFormatado(ticket.estado)}
                              </span>
                            </td>
                            <td className="p-3 text-sm md:text-base">
                              {getTecnicoNome(ticket.tecnico_id)}
                            </td>
                            <td className="p-3 text-sm md:text-base">
                              {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
                            </td>
                            <td className="p-3 text-sm md:text-base">
                              <button
                                className="text-[#E31B23] hover:text-[#C5161D] text-sm md:text-base"
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

                {/* Versão mobile */}
                <div className="lg:hidden space-y-4">
                  {tickets.map((ticket) => {
                    const numeroPatrimonio = ticket.patrimonio
                      ? String(ticket.patrimonio).padStart(7, "0")
                      : "N/A";
                    const descricaoText = ticket.descricao || "Sem descrição";

                    return (
                      <div key={ticket.id} className="bg-[#1B1F3B] p-4 rounded-lg">
                        <div className="flex justify-between items-start mb-2">
                          <h3 className="font-bold text-[#FFFDF7] text-sm sm:text-base">{ticket.titulo}</h3>
                          <span className="text-xs text-[#FFFDF7]/70">ID: {ticket.id}</span>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs sm:text-sm mb-3">
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
                            <span
                              className={`px-2 py-1 rounded-full text-xs ${
                                ticket.estado === "pendente"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : ticket.estado === "em_andamento"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : ticket.estado === "concluido"
                                  ? "bg-green-500/20 text-green-400"
                                  : "bg-red-500/20 text-red-400"
                              }`}
                            >
                              {getStatusFormatado(ticket.estado)}
                            </span>
                          </div>
                          <div>
                            <p className="text-[#FFFDF7]/70">Técnico:</p>
                            <p className="text-[#FFFDF7]">{getTecnicoNome(ticket.tecnico_id)}</p>
                          </div>
                        </div>

                        <div className="mb-3">
                          <p className="text-[#FFFDF7]/70 text-xs sm:text-sm">Descrição:</p>
                          <p className="text-[#FFFDF7] text-xs sm:text-sm line-clamp-2">{descricaoText}</p>
                        </div>

                        <div className="flex justify-between items-center">
                          <p className="text-[#FFFDF7]/70 text-xs">
                            {ticket.criado_em ? new Date(ticket.criado_em).toLocaleDateString("pt-BR") : "N/A"}
                          </p>
                          <button
                            className="text-[#E31B23] hover:text-[#C5161D] text-xs sm:text-sm"
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
            <h3 className="text-lg font-bold text-[#FFFDF7] mb-3 sm:mb-4">
              Relatórios do Chamado #{selectedTicket.id}
            </h3>
            <div className="mb-4">
              <p className="text-[#FFFDF7]/70 text-sm">
                <strong>Técnico Responsável:</strong> {getTecnicoNome(selectedTicket.tecnico_id)}
              </p>
              <p className="text-[#FFFDF7]/70 text-sm">
                <strong>Status:</strong> {getStatusFormatado(selectedTicket.estado)}
              </p>
            </div>
            
            <div className="mb-4 sm:mb-6 max-h-48 overflow-y-auto">
              {loadingApontamentos ? (
                <p className="text-[#FFFDF7]/90 text-xs sm:text-sm">Carregando apontamentos...</p>
              ) : apontamentos.length > 0 ? (
                <ul className="space-y-3">
                  {apontamentos.map((apontamento, index) => (
                    <li key={apontamento.id || index} className="text-[#FFFDF7]/90 text-xs sm:text-sm border-b border-[#FFFDF7]/10 pb-3">
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
                <p className="text-[#FFFDF7]/90 text-xs sm:text-sm">Nenhum relatório registrado ainda.</p>
              )}
            </div>
            <div className="flex justify-end">
              <button
                type="button"
                onClick={() => setShowNotesModal(false)}
                className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-3 py-1 sm:px-4 sm:py-2 rounded-lg font-bold hover:bg-[#FFFDF7]/30 text-sm sm:text-base"
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