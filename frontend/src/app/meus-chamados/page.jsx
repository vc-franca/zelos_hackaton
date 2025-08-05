"use client";

// Importando dependências necessárias para Next.js e React
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

// Definindo dados simulados para exibição de chamados
const mockTickets = [
  {
    id: "CH001",
    assetNumber: "ABC-1234",
    itemDescription: "Computador",
    room: "Sala 101",
    serviceType: "Manutenção",
    status: "Aberto",
    dateSubmitted: "2025-08-01",
    technician: "João Silva",
    notes: [],
  },
  {
    id: "CH002",
    assetNumber: "XYZ-5678",
    itemDescription: "Projetor",
    room: "Auditório",
    serviceType: "Reparo",
    status: "Em Andamento",
    dateSubmitted: "2025-08-02",
    technician: "Maria Oliveira",
    notes: ["Verificado cabo HDMI - 2025-08-03"],
  },
  {
    id: "CH003",
    assetNumber: "DEF-9012",
    itemDescription: "Impressora",
    room: "Sala 202",
    serviceType: "Instalação",
    status: "Concluído",
    dateSubmitted: "2025-07-30",
    technician: "Carlos Souza",
    notes: ["Instalação concluída - 2025-07-31"],
  },
];

// Definindo componente principal para acompanhamento de chamados
export default function MeusChamados() {
  // Gerenciando estado dos chamados (usando dados simulados)
  const [tickets, setTickets] = useState(mockTickets);
  // Controlando visibilidade do modal de apontamentos
  const [showNotesModal, setShowNotesModal] = useState(false);
  // Armazenando chamado selecionado para apontamentos
  const [selectedTicket, setSelectedTicket] = useState(null);
  // Gerenciando texto do novo apontamento
  const [newNote, setNewNote] = useState("");

  // Adicionando apontamento ao chamado selecionado (simulação)
  const handleAddNote = (e) => {
    e.preventDefault();
    if (newNote.trim()) {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicket.id
            ? { ...ticket, notes: [...ticket.notes, `${newNote} - ${new Date().toISOString().split("T")[0]}`] }
            : ticket
        )
      );
      setNewNote("");
      setShowNotesModal(false);
    }
  };

  // Renderizando a interface do componente
  return (
    <>
      {/* Configurando metadados da página */}
      <Head>
        <title>Acompanhar Chamados | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Acompanhe o status dos seus chamados de manutenção e visualize apontamentos técnicos."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Definindo estilos globais para animações, tooltips e responsividade */}
      <style jsx global>{`
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes fade-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out forwards;
        }
        .tooltip {
          position: relative;
        }
        .tooltip:hover::after {
          content: attr(data-tooltip);
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%);
          background: #fffdf7;
          color: #1b1f3b;
          padding: 6px 10px;
          border-radius: 4px;
          font-size: 0.75rem;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        .ticket-card {
          background: linear-gradient(145deg, #2d3250, #1b1f3b);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .ticket-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
        }
        @media (max-width: 639px) {
          .ticket-card {
            padding: 12px;
            font-size: 0.875rem;
          }
          .tooltip:hover::after {
            font-size: 0.7rem;
            padding: 5px 8px;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .ticket-card {
            padding: 16px;
            font-size: 0.9375rem;
          }
          .tooltip:hover::after {
            font-size: 0.75rem;
            padding: 6px 10px;
          }
        }
        @media (min-width: 1024px) {
          .table-container table {
            border-collapse: separate;
            border-spacing: 0 8px;
          }
          .table-container th {
            position: sticky;
            top: 0;
            background: #1b1f3b;
            z-index: 10;
          }
          .table-container td {
            background: #2d3250;
            padding: 16px;
          }
          .table-container tr {
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .tooltip:hover::after {
            font-size: 0.75rem;
            padding: 6px 10px;
          }
        }
      `}</style>
      {/* Renderizando contêiner principal da página */}
      <div className="min-h-screen bg-[#FFFDF7] font-sans">
        {/* Renderizando seção de cabeçalho */}
        <section className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto text-center">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Acompanhar Chamados
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Visualize o status dos seus chamados e acompanhe as atualizações dos técnicos
            </p>
            <Link
              href="/"
              className="text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300 text-sm sm:text-base md:text-lg font-medium"
              aria-label="Voltar para a página inicial"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </section>

        {/* Renderizando seção de lista de chamados */}
        <section className="py-12 sm:py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="bg-[#2D3250] p-6 sm:p-8 rounded-xl shadow-lg border-t-4 border-[#E31B23] animate-slide-up">
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFFDF7] mb-6">Meus Chamados</h2>
              {/* Renderizando layout de cartões para telas pequenas e tablets */}
              <div
                className="lg:hidden grid gap-4 sm:grid-cols-1 md:grid-cols-2"
                role="region"
                aria-label="Lista de chamados"
              >
                {tickets.map((ticket, index) => (
                  <div
                    key={ticket.id}
                    className="ticket-card p-4 sm:p-5 rounded-lg shadow-md animate-slide-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="grid grid-cols-2 gap-2 text-[#FFFDF7] text-sm sm:text-base md:text-base">
                      <div className="font-medium">ID:</div>
                      <div>{ticket.id}</div>
                      <div className="font-medium">Patrimônio:</div>
                      <div>{ticket.assetNumber}</div>
                      <div className="font-medium">Item:</div>
                      <div>{ticket.itemDescription}</div>
                      <div className="font-medium">Sala:</div>
                      <div>{ticket.room}</div>
                      <div className="font-medium">Serviço:</div>
                      <div>{ticket.serviceType}</div>
                      <div className="font-medium">Status:</div>
                      <div>
                        <span
                          className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                            ticket.status === "Aberto"
                              ? "bg-yellow-500/20 text-yellow-400"
                              : ticket.status === "Em Andamento"
                              ? "bg-blue-500/20 text-blue-400"
                              : "bg-green-500/20 text-green-400"
                          }`}
                        >
                          {ticket.status}
                        </span>
                      </div>
                      <div className="font-medium">Técnico:</div>
                      <div>{ticket.technician}</div>
                      <div className="font-medium">Data:</div>
                      <div>{ticket.dateSubmitted}</div>
                      <div className="font-medium">Ações:</div>
                      <div>
                        <button
                          className="text-[#E31B23] hover:text-[#C5161D] font-medium text-sm sm:text-base tooltip"
                          data-tooltip="Ver ou adicionar apontamentos"
                          onClick={() => {
                            setSelectedTicket(ticket);
                            setShowNotesModal(true);
                          }}
                          aria-label={`Ver apontamentos do chamado ${ticket.id}`}
                        >
                          Apontamentos
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Renderizando layout de tabela para telas maiores */}
              <div className="hidden lg:block table-container">
                <table className="w-full text-[#FFFDF7]">
                  <thead>
                    <tr className="bg-[#1B1F3B]">
                      <th className="p-4 text-left font-medium" aria-sort="none">ID</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Patrimônio</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Item</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Sala</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Serviço</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Status</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Técnico</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Data</th>
                      <th className="p-4 text-left font-medium" aria-sort="none">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => (
                      <tr
                        key={ticket.id}
                        className="hover:bg-[#1B1F3B]/70 transition duration-200 animate-slide-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                      >
                        <td className="p-4">{ticket.id}</td>
                        <td className="p-4">{ticket.assetNumber}</td>
                        <td className="p-4">{ticket.itemDescription}</td>
                        <td className="p-4">{ticket.room}</td>
                        <td className="p-4">{ticket.serviceType}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-1 rounded-full text-sm ${
                              ticket.status === "Aberto"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : ticket.status === "Em Andamento"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {ticket.status}
                          </span>
                        </td>
                        <td className="p-4">{ticket.technician}</td>
                        <td className="p-4">{ticket.dateSubmitted}</td>
                        <td className="p-4">
                          <button
                            className="text-[#E31B23] hover:text-[#C5161D] font-medium text-sm sm:text-base tooltip"
                            data-tooltip="Ver ou adicionar apontamentos"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setShowNotesModal(true);
                            }}
                            aria-label={`Ver apontamentos do chamado ${ticket.id}`}
                          >
                            Apontamentos
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </section>

        {/* Renderizando modal de apontamentos */}
        {showNotesModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in px-4">
            <div className="bg-[#2D3250] p-4 sm:p-5 md:p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFFDF7] mb-4">
                Apontamentos do Chamado {selectedTicket.id}
              </h3>
              <div className="mb-4 max-h-48 overflow-y-auto">
                {selectedTicket.notes.length > 0 ? (
                  <ul className="space-y-2">
                    {selectedTicket.notes.map((note, index) => (
                      <li key={index} className="text-[#FFFDF7]/80 text-sm border-b border-[#FFFDF7]/10 pb-2">
                        {note}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-[#FFFDF7]/80 text-sm">Nenhum apontamento registrado.</p>
                )}
              </div>
              <form onSubmit={handleAddNote}>
                <label
                  htmlFor="newNote"
                  className="block text-base sm:text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                  data-tooltip="Adicione um novo apontamento para o chamado"
                >
                  Novo Apontamento
                </label>
                <textarea
                  id="newNote"
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200"
                  rows="4"
                  maxLength="500"
                  aria-describedby="newNote-hint"
                ></textarea>
                <p id="newNote-hint" className="text-sm text-[#FFFDF7]/70 mt-1">
                  {newNote.length}/500 caracteres
                </p>
                <div className="flex justify-end gap-3 sm:gap-4 mt-4">
                  <button
                    type="button"
                    onClick={() => setShowNotesModal(false)}
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-[#FFFDF7]/30 transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFDF7] min-w-[100px]"
                    aria-label="Fechar modal"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#E31B23] text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-[#C5161D] transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23] min-w-[100px]"
                    aria-label="Adicionar apontamento"
                  >
                    Adicionar
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