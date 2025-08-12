"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

// Mapeamento de tipo e técnico
const tipoMap = {
  1: "Manutenção",
  2: "Reparo",
  3: "Instalação",
};

const tecnicoMap = {
  1: "João Silva",
  2: "Maria Oliveira",
  3: "Carlos Souza",
};

// Função para extrair número de patrimônio e descrição
const parseDescricao = (descricao) => {
  const match = descricao?.match(/Patrimônio: ([A-Z0-9-]+) - Descrição: (.*)/);
  return match
    ? { numeroPatrimonio: match[1], descricaoText: match[2] }
    : { numeroPatrimonio: "N/A", descricaoText: descricao };
};

export default function MeusChamados() {
  const [tickets, setTickets] = useState([]);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);

  // Buscar chamados da API usando axios
  useEffect(() => {
    const fetchChamados = async () => {
      try {
        const { data } = await axios.get("http://localhost:8080/chamados");
        setTickets(data);
      } catch (err) {
        console.error("Erro ao buscar chamados:", err);
      }
    };

    fetchChamados();
  }, []);

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
        {/* Cabeçalho */}
        <section className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl font-bold mb-6">Meus Chamados</h1>
            <p className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto text-[#FFFDF7]/90">
              Acompanhe o status dos seus chamados e visualize os relatórios dos técnicos
            </p>
            <Link
              href="/"
              className="text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </section>

        {/* Lista de chamados */}
        <section className="py-12 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#2D3250] p-6 rounded-xl shadow-lg border-t-4 border-[#E31B23]">
              <h2 className="text-xl sm:text-2xl font-bold text-[#FFFDF7] mb-6">
                Chamados Registrados
              </h2>

              {/* Tabela */}
              <div className="hidden lg:block table-container overflow-x-auto">
                <table className="w-full text-[#FFFDF7]">
                  <thead>
                    <tr className="bg-[#1B1F3B]">
                      <th className="p-4 text-left">ID</th>
                      <th className="p-4 text-left">Título</th>
                      <th className="p-4 text-left">Nº Patrimônio</th>
                      <th className="p-4 text-left">Descrição</th>
                      <th className="p-4 text-left">Tipo</th>
                      <th className="p-4 text-left">Status</th>
                      <th className="p-4 text-left">Técnico</th>
                      <th className="p-4 text-left">Data</th>
                      <th className="p-4 text-left">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket) => {
                      const { numeroPatrimonio, descricaoText } = parseDescricao(ticket.descricao);
                      return (
                        <tr key={ticket.id}>
                          <td className="p-4">{ticket.id}</td>
                          <td className="p-4">{ticket.titulo}</td>
                          <td className="p-4">{numeroPatrimonio}</td>
                          <td className="p-4">{descricaoText}</td>
                          <td className="p-4">{tipoMap[ticket.tipo_id]}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
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
                          <td className="p-4">{tecnicoMap[ticket.tecnico_id] || "Não atribuído"}</td>
                          <td className="p-4">
                            {new Date(ticket.criado_em).toLocaleDateString("pt-BR")}
                          </td>
                          <td className="p-4">
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
            </div>
          </div>
        </section>

        {/* Modal */}
        {showNotesModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 px-4">
            <div className="bg-[#2D3250] p-6 rounded-xl shadow-lg max-w-lg w-full">
              <h3 className="text-lg font-bold text-[#FFFDF7] mb-4">
                Relatórios do Chamado {selectedTicket.id}
              </h3>
              <div className="mb-6 max-h-48 overflow-y-auto">
                {selectedTicket.notes?.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTicket.notes.map((note, index) => (
                      <li key={index} className="text-[#FFFDF7]/90 text-sm border-b border-[#FFFDF7]/10 pb-2">
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#FFFDF7]/90 text-sm">Nenhum relatório registrado.</p>
                )}
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setShowNotesModal(false)}
                  className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-4 py-2 rounded-lg font-bold hover:bg-[#FFFDF7]/30"
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
