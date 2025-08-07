// Habilitando renderização no lado do cliente para interatividade com React hooks
"use client";

// Importando dependências necessárias para a construção da página
import Link from "next/link";
import Head from "next/head";
import { useState } from "react";

// Definindo mapeamento de tipo_id para nomes legíveis, consistente com novo-chamado.jsx
const tipoMap = {
  1: "Manutenção",
  2: "Reparo",
  3: "Instalação",
};

// Definindo mapeamento de tecnico_id para nomes legíveis, consistente com novo-chamado.jsx
const tecnicoMap = {
  1: "João Silva",
  2: "Maria Oliveira",
  3: "Carlos Souza",
};

// Definindo dados simulados para os chamados, refletindo a estrutura da tabela `chamados`
const mockTickets = [
  {
    id: 1,
    titulo: "Problema no Computador",
    descricao: "Patrimônio: PC123 - Descrição: Computador não liga, tela preta.",
    tipo_id: 1, // Mapeado como "Manutenção"
    tecnico_id: 1, // Mapeado como "João Silva"
    usuario_id: 101,
    status: "pendente",
    criado_em: "2025-08-01T10:00:00",
    notes: [],
  },
  {
    id: 2,
    titulo: "Projetor com Falha",
    descricao: "Patrimônio: PJ456 - Descrição: Projetor não exibe imagem, possível problema no cabo HDMI.",
    tipo_id: 2, // Mapeado como "Reparo"
    tecnico_id: 2, // Mapeado como "Maria Oliveira"
    usuario_id: 101,
    status: "em andamento",
    criado_em: "2025-08-02T14:30:00",
    notes: ["Verificado cabo HDMI, substituição recomendada - 2025-08-03"],
  },
  {
    id: 3,
    titulo: "Instalação de Impressora",
    descricao: "Patrimônio: IM789 - Descrição: Necessária instalação de nova impressora na sala 202.",
    tipo_id: 3, // Mapeado como "Instalação"
    tecnico_id: 3, // Mapeado como "Carlos Souza"
    usuario_id: 101,
    status: "concluído",
    criado_em: "2025-07-30T09:15:00",
    notes: ["Instalação concluída, drivers atualizados - 2025-07-31"],
  },
];

// Função para parsear descrição em número de patrimônio e texto descritivo
const parseDescricao = (descricao) => {
  const match = descricao.match(/Patrimônio: ([A-Z0-9-]+) - Descrição: (.*)/);
  return match
    ? { numeroPatrimonio: match[1], descricaoText: match[2] }
    : { numeroPatrimonio: "N/A", descricaoText: descricao };
};

// Definindo componente principal para o painel do técnico
export default function PainelTecnico() {
  // Gerenciando estado dos chamados com dados simulados
  const [tickets, setTickets] = useState(mockTickets);
  // Controlando visibilidade do modal de gerenciamento
  const [showManageModal, setShowManageModal] = useState(false);
  // Armazenando chamado selecionado para gerenciamento
  const [selectedTicket, setSelectedTicket] = useState(null);
  // Gerenciando novo status do chamado
  const [newStatus, setNewStatus] = useState("");
  // Gerenciando novo relatório (apontamento)
  const [newNote, setNewNote] = useState("");

  // Manipulando atualização do status e adição de relatório
  const handleUpdateTicket = (e) => {
    e.preventDefault();
    if (newStatus || newNote.trim()) {
      setTickets((prev) =>
        prev.map((ticket) =>
          ticket.id === selectedTicket.id
            ? {
                ...ticket,
                status: newStatus || ticket.status,
                notes: newNote.trim()
                  ? [...ticket.notes, `${newNote} - ${new Date().toISOString().split("T")[0]}`]
                  : ticket.notes,
              }
            : ticket
        )
      );
      setNewStatus("");
      setNewNote("");
      setShowManageModal(false);
    }
  };

  // Renderizando a interface do componente
  return (
    <>
      {/* Configurando metadados da página para SEO e acessibilidade */}
      <Head>
        <title>Painel do Técnico | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Gerencie chamados de manutenção, atualize status e adicione relatórios técnicos."
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
            border-radius: 6px 6px 0 0;
            font-weight: 600;
            padding: 16px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
          }
          .table-container td {
            background: #2d3250;
            padding: 16px;
            border-radius: 4px;
          }
          .table-container tr {
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
            transition: transform 0.2s ease, background 0.2s ease;
          }
          .table-container tr:hover {
            background: linear-gradient(145deg, #1b1f3b, #2d3250);
            transform: scale(1.005);
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
              Painel do Técnico
            </h1>
            <p
              className="text-base sm:text-lg md:text-xl mb-8 max-w-3xl mx-auto animate-slide-up"
              style={{ animationDelay: "0.2s" }}
            >
              Gerencie chamados, atualize o status e adicione relatórios técnicos visíveis para os usuários
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
              <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-[#FFFDF7] mb-6">Chamados Atribuídos</h2>
              {/* Renderizando layout de cartões para telas pequenas e tablets */}
              <div
                className="lg:hidden grid gap-4 sm:grid-cols-1 md:grid-cols-2"
                role="region"
                aria-label="Lista de chamados"
              >
                {tickets.map((ticket, index) => {
                  const { numeroPatrimonio, descricaoText } = parseDescricao(ticket.descricao);
                  return (
                    <div
                      key={ticket.id}
                      className="ticket-card p-4 sm:p-5 rounded-lg shadow-md animate-slide-up"
                      style={{ animationDelay: `${index * 0.1}s` }}
                    >
                      <div className="grid grid-cols-2 gap-2 text-[#FFFDF7] text-sm sm:text-base md:text-base">
                        <div className="font-medium">ID:</div>
                        <div>{ticket.id}</div>
                        <div className="font-medium">Título:</div>
                        <div>{ticket.titulo}</div>
                        <div className="font-medium">Nº Patrimônio:</div>
                        <div>{numeroPatrimonio}</div>
                        <div className="font-medium">Descrição:</div>
                        <div className="truncate">{descricaoText}</div>
                        <div className="font-medium">Tipo:</div>
                        <div>{tipoMap[ticket.tipo_id]}</div>
                        <div className="font-medium">Status:</div>
                        <div>
                          <span
                            className={`px-2 py-1 rounded-full text-xs sm:text-sm ${
                              ticket.status === "pendente"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : ticket.status === "em andamento"
                                ? "bg-blue-500/20 text-blue-400"
                                : "bg-green-500/20 text-green-400"
                            }`}
                          >
                            {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                          </span>
                        </div>
                        <div className="font-medium">Técnico:</div>
                        <div>{tecnicoMap[ticket.tecnico_id]}</div>
                        <div className="font-medium">Data:</div>
                        <div>{new Date(ticket.criado_em).toLocaleDateString("pt-BR")}</div>
                        <div className="font-medium">Ações:</div>
                        <div>
                          <button
                            className="text-[#E31B23] hover:text-[#C5161D] font-medium text-sm sm:text-base tooltip"
                            data-tooltip="Gerenciar chamado"
                            onClick={() => {
                              setSelectedTicket(ticket);
                              setNewStatus(ticket.status);
                              setShowManageModal(true);
                            }}
                            aria-label={`Gerenciar chamado ${ticket.id}`}
                          >
                            Gerenciar
                          </button>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
              {/* Renderizando layout de tabela para telas maiores */}
              <div className="hidden lg:block table-container">
                <table className="w-full text-[#FFFDF7]">
                  <thead>
                    <tr className="bg-[#1B1F3B]">
                      <th className="p-4 text-left font-medium w-[8%]" aria-sort="none">ID</th>
                      <th className="p-4 text-left font-medium w-[15%]" aria-sort="none">Título</th>
                      <th className="p-4 text-left font-medium w-[12%]" aria-sort="none">Nº Patrimônio</th>
                      <th className="p-4 text-left font-medium w-[20%]" aria-sort="none">Descrição</th>
                      <th className="p-4 text-left font-medium w-[10%]" aria-sort="none">Tipo</th>
                      <th className="p-4 text-left font-medium w-[10%]" aria-sort="none">Status</th>
                      <th className="p-4 text-left font-medium w-[12%]" aria-sort="none">Técnico</th>
                      <th className="p-4 text-left font-medium w-[10%]" aria-sort="none">Data</th>
                      <th className="p-4 text-left font-medium w-[8%]" aria-sort="none">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {tickets.map((ticket, index) => {
                      const { numeroPatrimonio, descricaoText } = parseDescricao(ticket.descricao);
                      return (
                        <tr
                          key={ticket.id}
                          className="hover:bg-[#1B1F3B]/70 transition duration-200 animate-slide-up"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <td className="p-4">{ticket.id}</td>
                          <td className="p-4">{ticket.titulo}</td>
                          <td className="p-4">{numeroPatrimonio}</td>
                          <td className="p-4">{descricaoText}</td>
                          <td className="p-4">{tipoMap[ticket.tipo_id]}</td>
                          <td className="p-4">
                            <span
                              className={`px-2 py-1 rounded-full text-sm ${
                                ticket.status === "pendente"
                                  ? "bg-yellow-500/20 text-yellow-400"
                                  : ticket.status === "em andamento"
                                  ? "bg-blue-500/20 text-blue-400"
                                  : "bg-green-500/20 text-green-400"
                              }`}
                            >
                              {ticket.status.charAt(0).toUpperCase() + ticket.status.slice(1)}
                            </span>
                          </td>
                          <td className="p-4">{tecnicoMap[ticket.tecnico_id]}</td>
                          <td className="p-4">{new Date(ticket.criado_em).toLocaleDateString("pt-BR")}</td>
                          <td className="p-4">
                            <button
                              className="text-[#E31B23] hover:text-[#C5161D] font-medium text-sm sm:text-base tooltip"
                              data-tooltip="Gerenciar chamado"
                              onClick={() => {
                                setSelectedTicket(ticket);
                                setNewStatus(ticket.status);
                                setShowManageModal(true);
                              }}
                              aria-label={`Gerenciar chamado ${ticket.id}`}
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
            </div>
          </div>
        </section>

        {/* Renderizando modal de gerenciamento do chamado */}
        {showManageModal && selectedTicket && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in px-4">
            <div className="bg-[#2D3250] p-4 sm:p-5 md:p-6 rounded-xl shadow-lg max-w-md w-full">
              <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-[#FFFDF7] mb-4">
                Gerenciar Chamado {selectedTicket.id}
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
                  <p className="text-[#FFFDF7]/80 text-sm">Nenhum relatório registrado.</p>
                )}
              </div>
              <form onSubmit={handleUpdateTicket}>
                <div className="mb-4">
                  <label
                    htmlFor="newStatus"
                    className="block text-base sm:text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Atualize o status do chamado"
                  >
                    Status
                  </label>
                  <select
                    id="newStatus"
                    value={newStatus}
                    onChange={(e) => setNewStatus(e.target.value)}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200"
                    aria-describedby="newStatus-hint"
                  >
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em Andamento</option>
                    <option value="concluído">Concluído</option>
                  </select>
                </div>
                <div className="mb-4">
                  <label
                    htmlFor="newNote"
                    className="block text-base sm:text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Adicione um relatório técnico visível para os usuários"
                  >
                    Novo Relatório
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
                </div>
                <div className="flex justify-end gap-3 sm:gap-4">
                  <button
                    type="button"
                    onClick={() => {
                      setShowManageModal(false);
                      setNewStatus("");
                      setNewNote("");
                    }}
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-[#FFFDF7]/30 transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFDF7] min-w-[100px]"
                    aria-label="Fechar modal"
                  >
                    Fechar
                  </button>
                  <button
                    type="submit"
                    className="bg-[#E31B23] text-white px-3 sm:px-4 py-2 rounded-lg font-bold hover:bg-[#C5161D] transition duration-200 focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23] min-w-[100px]"
                    aria-label="Salvar alterações"
                  >
                    Salvar
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