"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

const tipoMap = {
  1: "Manutenção",
  2: "Reparo",
  3: "Instalação",
};

const statusOptions = [
  { value: "pendente", label: "Pendente", color: "yellow" },
  { value: "em andamento", label: "Em Andamento", color: "blue" },
  { value: "concluído", label: "Concluído", color: "green" }
];

export default function PainelTecnico() {
  const [tickets, setTickets] = useState([]);
  const [showManageModal, setShowManageModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [newNote, setNewNote] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // Buscar chamados da API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        setIsLoading(true);
        const { data } = await axios.get("http://localhost:8080/chamados");
        setTickets(data);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
        setError("Erro ao carregar chamados. Tente novamente mais tarde.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTickets();
  }, []);

  // Parsear descrição do chamado
  const parseDescricao = (descricao) => {
    const match = descricao?.match(/Patrimônio: ([A-Z0-9-]+) - Descrição: (.*)/);
    return match
      ? { numeroPatrimonio: match[1], descricaoText: match[2] }
      : { numeroPatrimonio: "N/A", descricaoText: descricao };
  };

  // Atualizar chamado
  const handleUpdateTicket = async (e) => {
    e.preventDefault();
    
    if (!selectedTicket) return;

    try {
      setIsLoading(true);
      
      const updatedTicket = {
        ...selectedTicket,
        status: newStatus || selectedTicket.status,
        notes: newNote.trim()
          ? [...(selectedTicket.notes || []), `${new Date().toLocaleDateString("pt-BR")} - ${newNote}`]
          : selectedTicket.notes
      };

      await axios.put(`http://localhost:8080/chamados/${selectedTicket.id}`, updatedTicket);
      
      setTickets(prev => 
        prev.map(ticket => 
          ticket.id === selectedTicket.id ? updatedTicket : ticket
        )
      );
      
      setShowManageModal(false);
      setNewStatus("");
      setNewNote("");
    } catch (err) {
      console.error("Erro ao atualizar chamado:", err);
      setError("Erro ao atualizar chamado. Tente novamente.");
    } finally {
      setIsLoading(false);
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
    <>
      <Head>
        <title>Painel do Técnico | Sistema de Manutenção Escolar</title>
        <meta 
          name="description" 
          content="Gerencie chamados de manutenção, atualize status e adicione relatórios técnicos." 
        />
      </Head>

      <div className="min-h-screen bg-[#FFFDF7] font-sans">
        {/* Cabeçalho */}
        <header className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-12 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Painel do Técnico</h1>
            <p className="text-lg sm:text-xl mb-8 max-w-3xl mx-auto text-[#FFFDF7]/90">
              Gerencie chamados, atualize status e adicione relatórios visíveis aos usuários
            </p>
            <Link 
              href="/" 
              className="text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300"
            >
              Voltar para a Página Inicial
            </Link>
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
              <h2 className="text-2xl font-bold text-[#FFFDF7] mb-6">Chamados Atribuídos</h2>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#E31B23]"></div>
                </div>
              ) : tickets.length === 0 ? (
                <p className="text-[#FFFDF7]/80 text-center py-8">Nenhum chamado atribuído no momento.</p>
              ) : (
                <>
                  {/* Versão Mobile */}
                  <div className="lg:hidden space-y-4">
                    {tickets.map(ticket => {
                      const { numeroPatrimonio, descricaoText } = parseDescricao(ticket.descricao);
                      
                      return (
                        <div key={ticket.id} className="bg-[#1B1F3B] p-4 rounded-lg">
                          <div className="grid grid-cols-2 gap-3 text-sm">
                            <div className="text-[#FFFDF7]/70">ID:</div>
                            <div>{ticket.id}</div>
                            
                            <div className="text-[#FFFDF7]/70">Título:</div>
                            <div className="font-medium">{ticket.titulo}</div>
                            
                            <div className="text-[#FFFDF7]/70">Patrimônio:</div>
                            <div>{numeroPatrimonio}</div>
                            
                            <div className="text-[#FFFDF7]/70">Tipo:</div>
                            <div>{tipoMap[ticket.tipo_id] || "N/A"}</div>
                            
                            <div className="text-[#FFFDF7]/70">Status:</div>
                            <div>
                              <StatusBadge status={ticket.status} />
                            </div>
                            
                            <div className="text-[#FFFDF7]/70">Data:</div>
                            <div>{new Date(ticket.criado_em).toLocaleDateString("pt-BR")}</div>
                            
                            <div className="col-span-2">
                              <button
                                onClick={() => {
                                  setSelectedTicket(ticket);
                                  setNewStatus(ticket.status);
                                  setShowManageModal(true);
                                }}
                                className="w-full mt-2 bg-[#E31B23] hover:bg-[#C5161D] text-white py-2 rounded-lg font-medium"
                              >
                                Gerenciar
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
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
                        {tickets.map(ticket => {
                          const { numeroPatrimonio } = parseDescricao(ticket.descricao);
                          
                          return (
                            <tr key={ticket.id} className="border-b border-[#1B1F3B] hover:bg-[#1B1F3B]/50">
                              <td className="p-4">{ticket.id}</td>
                              <td className="p-4">{ticket.titulo}</td>
                              <td className="p-4">{numeroPatrimonio}</td>
                              <td className="p-4">{tipoMap[ticket.tipo_id] || "N/A"}</td>
                              <td className="p-4">
                                <StatusBadge status={ticket.status} />
                              </td>
                              <td className="p-4">
                                {new Date(ticket.criado_em).toLocaleDateString("pt-BR")}
                              </td>
                              <td className="p-4">
                                <button
                                  onClick={() => {
                                    setSelectedTicket(ticket);
                                    setNewStatus(ticket.status);
                                    setShowManageModal(true);
                                  }}
                                  className="text-[#E31B23] hover:text-[#C5161D] font-medium"
                                >
                                  Gerenciar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
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
            <div className="bg-[#2D3250] rounded-xl shadow-lg max-w-md w-full p-6">
              <h3 className="text-xl font-bold text-[#FFFDF7] mb-4">
                Gerenciar Chamado #{selectedTicket.id}
              </h3>
              
              <div className="mb-6">
                <h4 className="text-lg font-semibold text-[#FFFDF7] mb-2">Relatórios</h4>
                {selectedTicket.notes?.length > 0 ? (
                  <div className="bg-[#1B1F3B] rounded-lg p-4 max-h-48 overflow-y-auto">
                    <ul className="space-y-3">
                      {selectedTicket.notes.map((note, index) => (
                        <li key={index} className="text-[#FFFDF7]/90 text-sm border-b border-[#FFFDF7]/10 pb-2 last:border-0">
                          {note}
                        </li>
                      ))}
                    </ul>
                  </div>
                ) : (
                  <p className="text-[#FFFDF7]/70 text-sm">Nenhum relatório registrado.</p>
                )}
              </div>
              
              <form onSubmit={handleUpdateTicket}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-[#FFFDF7] mb-2">
                    Status
                  </label>
                  <select
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg"
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
                    Adicionar Relatório
                  </label>
                  <textarea
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg"
                    rows={4}
                    placeholder="Descreva as ações realizadas..."
                  />
                </div>
                
                <div className="flex justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setShowManageModal(false)}
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg font-medium hover:bg-[#FFFDF7]/30"
                  >
                    Cancelar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#E31B23] hover:bg-[#C5161D] text-white px-4 py-2 rounded-lg font-medium"
                    disabled={isLoading}
                  >
                    {isLoading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </>
  );
}