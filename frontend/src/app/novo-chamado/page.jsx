"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";

export default function NovoChamado() {
  const [formData, setFormData] = useState({
    assetNumber: "",
    itemDescription: "",
    room: "",
    serviceType: "",
    additionalDetails: "",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.assetNumber.match(/^[A-Z0-9-]{3,10}$/)) {
      newErrors.assetNumber = "O número de patrimônio deve ter 3-10 caracteres alfanuméricos.";
    }
    if (!formData.itemDescription.trim()) {
      newErrors.itemDescription = "A descrição do item é obrigatória.";
    }
    if (!formData.room.trim()) {
      newErrors.room = "A sala é obrigatória.";
    }
    if (!formData.serviceType) {
      newErrors.serviceType = "Selecione um tipo de serviço.";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      setIsSubmitting(true);
      setTimeout(() => {
        console.log("Form submitted:", formData);
        setIsSubmitting(false);
        setShowSuccess(true);
        setFormData({
          assetNumber: "",
          itemDescription: "",
          room: "",
          serviceType: "",
          additionalDetails: "",
        });
      }, 1000);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  return (
    <>
      <Head>
        <title>Abrir Novo Chamado | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Registre chamados de manutenção para equipamentos escolares com agilidade e precisão."
        />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
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
      `}</style>
      <div className="min-h-screen bg-[#FFFDF7] font-sans">
        {/* Header Section */}
        <section className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-16 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">
              Abrir Novo Chamado
            </h1>
            <p
              className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up"
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

        {/* Form Section */}
        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#2D3250] p-8 rounded-xl shadow-lg border-t-4 border-[#E31B23] animate-slide-up">
              <h2 className="text-3xl font-bold text-[#FFFDF7] mb-6">Formulário de Novo Chamado</h2>
              <form onSubmit={handleSubmit} className="space-y-6" noValidate aria-live="polite">
                <div>
                  <label
                    htmlFor="assetNumber"
                    className="block text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Digite o número de patrimônio (3-10 caracteres alfanuméricos)"
                  >
                    Número de Patrimônio <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="assetNumber"
                    name="assetNumber"
                    value={formData.assetNumber}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.assetNumber ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/50`}
                    required
                    aria-describedby="assetNumber-error"
                    disabled={isSubmitting}
                  />
                  {errors.assetNumber && (
                    <p id="assetNumber-error" className="text-red-400 text-sm mt-1 animate-fade-in">
                      {errors.assetNumber}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="itemDescription"
                    className="block text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Descreva o equipamento (ex.: Computador, Projetor)"
                  >
                    Descrição do Item <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="itemDescription"
                    name="itemDescription"
                    value={formData.itemDescription}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.itemDescription ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/50`}
                    required
                    aria-describedby="itemDescription-error"
                    disabled={isSubmitting}
                  />
                  {errors.itemDescription && (
                    <p id="itemDescription-error" className="text-red-400 text-sm mt-1 animate-fade-in">
                      {errors.itemDescription}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="room"
                    className="block text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Indique a sala onde o equipamento está localizado"
                  >
                    Sala <span className="text-[#E31B23]">*</span>
                  </label>
                  <input
                    type="text"
                    id="room"
                    name="room"
                    value={formData.room}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.room ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/50`}
                    required
                    aria-describedby="room-error"
                    disabled={isSubmitting}
                  />
                  {errors.room && (
                    <p id="room-error" className="text-red-400 text-sm mt-1 animate-fade-in">
                      {errors.room}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="serviceType"
                    className="block text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Escolha o tipo de serviço necessário"
                  >
                    Tipo de Serviço <span className="text-[#E31B23]">*</span>
                  </label>
                  <select
                    id="serviceType"
                    name="serviceType"
                    value={formData.serviceType}
                    onChange={handleInputChange}
                    className={`w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border ${
                      errors.serviceType ? "border-red-500" : "border-[#FFFDF7]/20"
                    } rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200`}
                    required
                    aria-describedby="serviceType-error"
                    disabled={isSubmitting}
                  >
                    <option value="" disabled>
                      Selecione o tipo de serviço
                    </option>
                    <option value="manutencao">Manutenção</option>
                    <option value="reparo">Reparo</option>
                    <option value="instalacao">Instalação</option>
                    <option value="outro">Outro</option>
                  </select>
                  {errors.serviceType && (
                    <p id="serviceType-error" className="text-red-400 text-sm mt-1 animate-fade-in">
                      {errors.serviceType}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="additionalDetails"
                    className="block text-lg font-medium text-[#FFFDF7] mb-2 tooltip"
                    data-tooltip="Forneça detalhes adicionais sobre o problema ou serviço"
                  >
                    Detalhes Adicionais
                  </label>
                  <textarea
                    id="additionalDetails"
                    name="additionalDetails"
                    value={formData.additionalDetails}
                    onChange={handleInputChange}
                    className="w-full p-3 bg-[#1B1F3B] text-[#FFFDF7] border border-[#FFFDF7]/20 rounded-lg focus:ring-2 focus:ring-[#E31B23] focus:border-transparent transition duration-200 placeholder-[#FFFDF7]/50"
                    rows="5"
                    maxLength="500"
                    aria-describedby="additionalDetails-hint"
                    disabled={isSubmitting}
                  ></textarea>
                  <p id="additionalDetails-hint" className="text-sm text-[#FFFDF7]/70 mt-1">
                    Opcional: {formData.additionalDetails.length}/500 caracteres
                  </p>
                </div>

                <div className="flex justify-end gap-4">
                  <Link
                    href="/"
                    className="bg-[#FFFDF7]/20 text-[#FFFDF7] px-6 py-3 rounded-lg font-bold hover:bg-[#FFFDF7]/30 transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFDF7]"
                    aria-label="Cancelar"
                  >
                    Cancelar
                  </Link>
                  <button
                    type="submit"
                    className={`bg-[#E31B23] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#C5161D] transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23] flex items-center ${
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

        {/* Success Modal */}
        {showSuccess && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 animate-fade-in">
            <div className="bg-[#2D3250] p-8 rounded-xl shadow-lg max-w-md w-full text-center">
              <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                ✓
              </div>
              <h3 className="text-2xl font-bold text-[#FFFDF7] mb-4">Chamado Aberto com Sucesso!</h3>
              <p className="text-[#FFFDF7]/80 mb-6">
                Seu chamado foi registrado. Você será notificado sobre o progresso em breve.
              </p>
              <Link
                href="/meus-chamados"
                className="bg-[#E31B23] text-white px-6 py-3 rounded-lg font-bold hover:bg-[#C5161D] transition duration-300 focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23]"
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