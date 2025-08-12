"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

const tecnicoMap = {
  1: "João Silva",
  2: "Maria Oliveira",
  3: "Carlos Souza",
};

export default function NovoChamado() {
  const [formData, setFormData] = useState({
    titulo: "",
    numeroPatrimonio: "",
    descricao: "",
    tipo_id: "",
    tecnico_id: "1",
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [tipos, setTipos] = useState([]);

  useEffect(() => {
    async function fetchTipos() {
      try {
        const response = await axios.get("http://localhost:8080/pool"); // Sua API retorna os tipos
        setTipos(response.data);
      } catch (error) {
        console.error("Erro ao carregar tipos:", error);
        setTipos([]);
      }
    }
    fetchTipos();
  }, []);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!formData.numeroPatrimonio.match(/^[A-Z0-9-]{3,10}$/))
      newErrors.numeroPatrimonio =
        "O número de patrimônio deve ter 3-10 caracteres alfanuméricos.";
    if (!formData.descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
    if (!formData.tipo_id) newErrors.tipo_id = "Selecione um tipo de serviço.";
    if (!formData.tecnico_id) newErrors.tecnico_id = "Selecione um técnico.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    const nowISO = new Date().toISOString();

    const payload = {
      titulo: formData.titulo,
      descricao: `Patrimônio: ${formData.numeroPatrimonio} - ${formData.descricao}`,
      tipo_id: parseInt(formData.tipo_id, 10),
      tecnico_id: parseInt(formData.tecnico_id, 10),
      usuario_id: 4, // fixo conforme exemplo
      estado: "pendente",
      criado_em: nowISO,
      atualizado_em: nowISO,
    };

    try {
      await axios.post("http://localhost:8080/chamados", payload);
      setShowSuccess(true);
      setFormData({
        titulo: "",
        numeroPatrimonio: "",
        descricao: "",
        tipo_id: "",
        tecnico_id: "1",
      });
    } catch (error) {
      console.error("Erro ao enviar chamado:", error);
      setSubmitError("Erro ao enviar chamado. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
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
      <div className="min-h-screen bg-[#FFFDF7] font-sans">
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

        <section className="py-20 px-4">
          <div className="max-w-3xl mx-auto">
            <div className="bg-[#2D3250] form-container rounded-xl shadow-lg border-t-4 border-[#E31B23] animate-slide-up">
              <h2 className="text-3xl font-bold text-[#FFFDF7] mb-6">Formulário de Novo Chamado</h2>
              <form onSubmit={handleSubmit} className="space-y-8" noValidate aria-live="polite">
                {/* Título */}
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

                {/* Número de Patrimônio */}
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

                {/* Descrição */}
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

                {/* Tipo de Serviço */}
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
                    {tipos.map((tipo) => (
                      <option key={tipo.id} value={tipo.id}>
                        {tipo.titulo}
                      </option>
                    ))}
                  </select>
                  {errors.tipo_id && (
                    <p id="tipo_id-error" className="text-red-400 text-sm mt-2 animate-fade-in">
                      {errors.tipo_id}
                    </p>
                  )}
                </div>

                {/* Técnico */}
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

                {/* Erro geral no envio */}
                {submitError && (
                  <p className="text-red-500 font-semibold animate-fade-in">{submitError}</p>
                )}

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
