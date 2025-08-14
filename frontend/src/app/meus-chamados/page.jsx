"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeamento de tipos de serviço
const tipoMap = {
  1: "Manutenção",
  2: "Reparo",
  3: "Instalação",
};

// Mapeamento de técnicos
const tecnicoMap = {
  1: "João Silva",
  2: "Maria Oliveira",
  3: "Carlos Souza",
};

export default function MeusChamados() {
  // Estado para armazenar os chamados
  const [tickets, setTickets] = useState([]);
  // Estado para controlar exibição do modal de apontamentos
  const [showNotesModal, setShowNotesModal] = useState(false);
  // Chamado selecionado para visualizar relatórios
  const [selectedTicket, setSelectedTicket] = useState(null);
  // Estado para armazenar apontamentos do chamado
  const [apontamentos, setApontamentos] = useState([]);

  // Efeito para buscar chamados na API quando o componente monta
  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/chamados");
        setTickets(data); // Atualiza o estado com os chamados recebidos
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
      }
    };

    fetchChamados();
  }, []);

  // Efeito para buscar apontamentos quando o modal é aberto
  useEffect(() => {
    if (showNotesModal && selectedTicket) {
      const fetchApontamentos = async () => {
        try {
          const { data } = await axios.get(
            `http://localhost:8080/apontamentos?chamado_id=${selectedTicket.id}`
          );
          setApontamentos(data);
        } catch (err) {
          console.error("Erro ao buscar apontamentos:", err);
          setApontamentos([]);
        }
      };

      fetchApontamentos();
    }
  }, [showNotesModal, selectedTicket]);

  return (
    <>
      <Head>
        <title>Meus Chamados | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Acompanhe o status dos seus chamados de manutenção e visualize relatórios técnicos."
        />
      </Head>

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
            <Link
              href="/"
              className="inline-block text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300 text-sm sm:text-base"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </header>

        {/* Lista de chamados */}
        <main className="py-8 sm:py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#2D3250] p-4 sm:p-6 rounded-xl shadow-lg border-t-4 border-[#E31B23]">
              <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFFDF7] mb-4 sm:mb-6">
                Chamados Registrados
              </h2>

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
                      // Formata o patrimônio com zeros à esquerda (4 dígitos)
                      const numeroPatrimonio = ticket.patrimonio
                        ? String(ticket.patrimonio).padStart(7, "0")
                        : "N/A";

                      const descricaoText = ticket.descricao;

                      return (
                        <tr
                          key={ticket.id}
                          className="border-b border-[#1B1F3B] hover:bg-[#1B1F3B]/50"
                        >
                          <td className="p-3 text-sm md:text-base">{ticket.id}</td>
                          <td className="p-3 text-sm md:text-base">{ticket.titulo}</td>
                          <td className="p-3 text-sm md:text-base">{numeroPatrimonio}</td>
                          <td className="p-3 text-sm md:text-base">{descricaoText}</td>
                          <td className="p-3 text-sm md:text-base">{tipoMap[ticket.tipo_id]}</td>
                          <td className="p-3 text-sm md:text-base">
                            <span
                              className={`px-2 py-1 rounded-full text-xs md:text-sm ${
                                ticket.status === "pendente"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : ticket.status === "em andamento"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {ticket.status}
                            </span>
                          </td>
                          <td className="p-3 text-sm md:text-base">
                            {tecnicoMap[ticket.tecnico_id] || "Não atribuído"}
                          </td>
                          <td className="p-3 text-sm md:text-base">
                            {new Date(ticket.criado_em).toLocaleDateString("pt-BR")}
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
                    ? String(ticket.patrimonio).padStart(4, "0")
                    : "N/A";
                  const descricaoText = ticket.descricao;

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
                          <p className="text-[#FFFDF7]">{tipoMap[ticket.tipo_id]}</p>
                        </div>
                        <div>
                          <p className="text-[#FFFDF7]/70">Status:</p>
                          <span
                            className={`px-2 py-1 rounded-full text-xs ${
                              ticket.status === "pendente"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : ticket.status === "em andamento"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </div>
                        <div>
                          <p className="text-[#FFFDF7]/70">Técnico:</p>
                          <p className="text-[#FFFDF7]">{tecnicoMap[ticket.tecnico_id] || "Não atribuído"}</p>
                        </div>
                      </div>

                      <div className="mb-3">
                        <p className="text-[#FFFDF7]/70 text-xs sm:text-sm">Descrição:</p>
                        <p className="text-[#FFFDF7] text-xs sm:text-sm line-clamp-2">{descricaoText}</p>
                      </div>

                      <div className="flex justify-between items-center">
                        <p className="text-[#FFFDF7]/70 text-xs">
                          {new Date(ticket.criado_em).toLocaleDateString("pt-BR")}
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
            </div>
          </div>
        </main>

        {/* Modal de apontamentos */}
        {showNotesModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#2D3250] p-4 sm:p-6 rounded-xl shadow-lg max-w-md w-full mx-4">
              <h3 className="text-lg font-bold text-[#FFFDF7] mb-3 sm:mb-4">
                Relatórios do Chamado {selectedTicket.id}
              </h3>
              <div className="mb-4 sm:mb-6 max-h-48 overflow-y-auto">
                {apontamentos.length > 0 ? (
                  <ul className="space-y-2">
                    {apontamentos.map((apontamento, index) => (
                      <li key={index} className="text-[#FFFDF7]/90 text-xs sm:text-sm border-b border-[#FFFDF7]/10 pb-2">
                        <p><strong>Técnico:</strong> {tecnicoMap[apontamento.tecnico_id] || "Desconhecido"}</p>
                        <p><strong>Descrição:</strong> {apontamento.descricao}</p>
                        <p><strong>Início:</strong> {new Date(apontamento.comeco).toLocaleString("pt-BR")}</p>
                        <p><strong>Fim:</strong> {new Date(apontamento.fim).toLocaleString("pt-BR")}</p>
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#FFFDF7]/90 text-xs sm:text-sm">Nenhum relatório registrado.</p>
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
    </>
  );
}
