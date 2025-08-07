// Habilitando renderização no lado do cliente para interatividade com React hooks e gerenciamento de estado
"use client";

// Importando dependências necessárias para a construção da página
import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";

// Definindo mapeamento de tipo_id para nomes legíveis, consistente com meus-chamados.jsx
const tipoMap = {
  1: "Manutenção",
  2: "Reparo",
  3: "Instalação",
};

// Definindo mapeamento de tecnico_id para nomes legíveis, consistente com meus-chamados.jsx
const tecnicoMap = {
  1: "João Silva",
  2: "Maria Oliveira",
  3: "Carlos Souza",
};

// Definindo o componente principal para abertura de novos chamados
export default function NovoChamado() {
  // Gerenciando o estado do formulário com os dados do chamado
  const [formData, setFormData] = useState({
    titulo: "",
    numeroPatrimonio: "",
    descricao: "",
    tipo_id: "",
    tecnico_id: "1", // Definindo valor padrão para técnico_id
  });
  // Gerenciando os erros de validação do formulário
  const [errors, setErrors] = useState({});
  // Controlando o estado de envio do formulário
  const [isSubmitting, setIsSubmitting] = useState(false);
  // Controlando a visibilidade do modal de sucesso
  const [showSuccess, setShowSuccess] = useState(false);

  // Validando os campos do formulário
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório.";
    }
    if (!formData.numeroPatrimonio.match(/^[A-Z0-9-]{3,10}$/)) {
      newErrors.numeroPatrimonio = "O número de patrimônio deve ter 3-10 caracteres alfanuméricos.";
    }
    if (!formData.descricao.trim()) {
      newErrors.descricao = "A descrição é obrigatória.";
    }
    if (!formData.tipo_id) {
      newErrors.tipo_id = "Selecione um tipo de serviço.";
    }
    if (!formData.tecnico_id) {
      newErrors.tecnico_id = "Selecione um técnico.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Manipulando mudanças nos campos do formulário
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  // Manipulando o envio do formulário
  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        // Simulando envio para backend com dados alinhados à tabela chamados
        const newTicket = {
          id: Math.max(...mockTickets.map((t) => t.id), 0) + 1, // Incremento simples para ID
          titulo: formData.titulo,
          descricao: `Patrimônio: ${formData.numeroPatrimonio} - Descrição: ${formData.descricao}`, // Combinando número de patrimônio e descrição
          tipo_id: parseInt(formData.tipo_id),
          tecnico_id: parseInt(formData.tecnico_id), // Técnico é obrigatório
          usuario_id: 101, // Usuário fixo para mock
          status: "pendente",
          criado_em: new Date().toISOString(),
          notes: [],
        };
        console.log("Novo chamado submetido:", newTicket); // Placeholder para integração futura
        setIsSubmitting(false);
        setShowSuccess(true);
        setFormData({
          titulo: "",
          numeroPatrimonio: "",
          descricao: "",
          tipo_id: "",
          tecnico_id: "1", // Redefinindo valor padrão após envio
        });
      }, 1000);
    }
  };

  // Configurando temporizador para fechar o modal de sucesso
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // Renderizando a interface do componente
  return (
    <>
      {/* Configurando metadados da página para SEO e acessibilidade */}
      <Head>
        <title>Abrir Novo Chamado | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Registre chamados de manutenção para equipamentos escolares com agilidade e precisão."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      {/* Definindo estilos globais para animações, tooltips e estados de formulário */}
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
            transform: scale(0.95);
          }
          to {
            opacity: 1;
            transform: scale(1);
          }
        }
        .animate-slide-up {
          animation: slide-up 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
        }
        .animate-fade-in {
          animation: fade-in 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
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
          padding: 8px 12px;
          border-radius: 4px;
          font-size: 0.875rem;
          white-space: nowrap;
          z-index: 10;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
        }
        input:disabled,
        select:disabled,
        textarea:disabled {
          opacity: 0.6;
          cursor: not-allowed;
        }
        .primary-button {
          background: linear-gradient(145deg, #e31b23, #c5161d);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .primary-button:hover:not(:disabled),
        .primary-button:focus:not(:disabled) {
          transform: scale(1.05);
          box-shadow: 0 0 8px rgba(227, 27, 35, 0.5);
        }
        @media (max-width: 639px) {
          .form-container {
            padding: 16px;
          }
          .tooltip:hover::after {
            font-size: 0.75rem;
            padding: 6px 10px;
          }
        }
        @media (min-width: 640px) and (max-width: 1023px) {
          .form-container {
            padding: 20px;
          }
          .tooltip:hover::after {
            font-size: 0.875rem;
            padding: 8px 12px;
          }
        }
        @media (min-width: 1024px) {
          .form-container {
            padding: 24px;
          }
        }
      `}</style>
      {/* Renderizando o contêiner principal da página */}
      <div className="min-h-screen bg-[#FFFDF7] font-sans">
        {/* Renderizando a seção de cabeçalho com título e navegação */}
        <section className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Abrir Novo Chamado
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up text-[#FFFDF7]/90"
              style={{ animationDelay: "0.2s" }}
            >
              Registre problemas em equipamentos escolares de forma rápida e organizada
            </p>
            <Link
              href="/"
              className="text-[#FFFDF7] underline hover:text-[#E31B23] transition duration-300 text-lg font-medium"
              aria-label="Voltar para a página inicial"
            >
              Voltar para a Página Inicial
            </Link>
          </div>
        </section>

        {/* Renderizando a seção do formulário */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#2D3250] form-container rounded-xl shadow-lg border-t-4 border-[#E31B23] animate-slide-up">
              <h2 className="text-3xl font-bold text-[#FFFDF7] mb-6">Formulário de Novo Chamado</h2>
              <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-live="polite">
                <div>
                  <label
                    htmlFor="titulo"
                    className="block text-lg font-semibold text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Digite um título para o chamado (ex.: Problema no Computador)"
                  >
                    Título <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="titulo"
                    name="titulo"
                    value={formData.titulo}
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.titulo ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-4 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/70`}
                    required
                    aria-describedby="titulo-error"
                    aria-invalid={!!errors.titulo}
                    disabled={isSubmitting}
                  />
                  {errors.titulo && (
                    <p id="titulo-error" className="text-red-400 text-sm mt-2 animate-fade-in">
                      {errors.titulo}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="numeroPatrimonio"
                    className="block text-lg font-semibold text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Digite o número de patrimônio (3-10 caracteres alfanuméricos)"
                  >
                    Número de Patrimônio <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="numeroPatrimonio"
                    name="numeroPatrimonio"
                    value={formData.numeroPatrimonio}
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.numeroPatrimonio ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-4 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/70`}
                    required
                    aria-describedby="numeroPatrimonio-error"
                    aria-invalid={!!errors.numeroPatrimonio}
                    disabled={isSubmitting}
                  />
                  {errors.numeroPatrimonio && (
                    <p id="numeroPatrimonio-error" className="text-red-400 text-sm mt-2 animate-fade-in">
                      {errors.numeroPatrimonio}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="descricao"
                    className="block text-lg font-semibold text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Descreva o problema detalhadamente"
                  >
                    Descrição <span className="text-[#E31B23]">*</span>
                  </label>
                  <textarea
                    id="descricao"
                    name="descricao"
                    value={formData.descricao}
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.descricao ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-4 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/70`}
                    rows="4"
                    required
                    aria-describedby="descricao-error"
                    aria-invalid={!!errors.descricao}
                    disabled={isSubmitting}
                  ></textarea>
                  {errors.descricao && (
                    <p id="descricao-error" className="text-red-400 text-sm mt-2 animate-fade-in">
                      {errors.descricao}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tipo_id"
                    className="block text-lg font-semibold text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Escolha o tipo de serviço necessário"
                  >
                    Tipo de Serviço <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    id="tipo_id"
                    name="tipo_id"
                    value={formData.tipo_id}
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.tipo_id ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-4 focus:ring-[#E31B23] focus:border-transparent transition duration-200`}
                    required
                    aria-describedby="tipo_id-error"
                    aria-invalid={!!errors.tipo_id}
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Selecione o tipo de serviço
                    </option>
                    <option value="1">Manutenção</option>
                    <option value="2">Reparo</option>
                    <option value="3">Instalação</option>
                  </select>
                  {errors.tipo_id && (
                    <p id="tipo_id-error" className="text-red-400 text-sm mt-2 animate-fade-in">
                      {errors.tipo_id}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="tecnico_id"
                    className="block text-lg font-semibold text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Escolha um técnico para atender o chamado"
                  >
                    Técnico Desejado <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    id="tecnico_id"
                    name="tecnico_id"
                    value={formData.tecnico_id}
                    onChange={handleInputChange}
                    className={`w-full p-4 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.tecnico_id ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-4 focus:ring-[#E31B23] focus:border-transparent transition duration-200`}
                    required
                    aria-describedby="tecnico_id-error"
                    aria-invalid={!!errors.tecnico_id}
                    disabled={isSubmitting}
                  >
                    {Object.entries(tecnicoMap).map(([id, nome]) => (
                      <option key={id} value={id}>
                        {nome}
                      </option>
                    ))}
                  </select>
                  {errors.tecnico_id && (
                    <p id="tecnico_id-error" className="text-red-400 text-sm mt-2 animate-fade-in">
                      {errors.tecnico_id}
                    </p>
                  )}
                </div>

                <div className="flex justify-end gap-4">
                  <Link
                    href="/"
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-6 py-3 rounded-lg font-bold hover:bg-[#FFFDF7]/30 transition duration-300 focus:ring-4 focus:ring-offset-2 focus:ring-[#FFFDF7]"
                    aria-label="Cancelar"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className={`primary-button text-white px-6 py-3 rounded-lg font-bold flex items-center ${
                      isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                    }`}
                    disabled={isSubmitting}
                    aria-label="Enviar chamado"
                  >
                    {isSubmitting ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Enviando...
                      </>
                    ) : (
                      "Enviar Chamado"
                    )}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </section>

        {/* Renderizando o modal de sucesso */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-[#2D3250] p-8 rounded-xl shadow-lg max-w-md w-full text-center border-t-4 border-[#E31B23]">
              <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-[#FFFDF7] mb-4">Chamado Aberto com Sucesso!</h3>
              <p className="text-[#FFFDF7]/90 mb-6">
                Seu chamado foi registrado. Acompanhe o progresso e visualize relatórios técnicos em breve.
              </p>
              <Link
                href="/meus-chamados"
                className="primary-button text-white px-6 py-3 rounded-lg font-bold focus:ring-4 focus:ring-offset-2 focus:ring-[#E31B23]"
                aria-label="Acompanhar chamados"
              >
                Acompanhar Chamados
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}