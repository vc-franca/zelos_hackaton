
"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NovoChamado() {
  const [formData, setFormData] = useState({
    titulo: "",
    numeroPatrimonio: "",
    descricao: "",
    tipo_id: "",
  });

  const [tipos, setTipos] = useState([]);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(null);
  const [usuarioLogadoId, setUsuarioLogadoId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:8080/auth/check-auth", {
          credentials: "include",
        });
        const data = await response.json();
        if (data.authenticated) {
          if (data.user.funcao !== "usuario") {
            window.location.href = data.user.funcao === "administrador" ? "/admin" : "/tecnicos";
            return;
          }
          setUsuarioLogadoId(data.user.id);
        } else {
          window.location.href = "/";
        }
      } catch (err) {
        console.error("Erro ao verificar autenticação:", err);
        setSubmitError("Erro ao verificar autenticação. Tente novamente.");
        window.location.href = "/";
      } finally {
        setIsLoading(false);
      }
    };
    checkAuth();
  }, []);

  useEffect(() => {
    if (!usuarioLogadoId) return;

    const fetchTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/pool");
        setTipos(response.data);
      } catch (error) {
        console.error("Erro ao carregar tipos:", error);
        setTipos([]);
        setSubmitError("Erro ao carregar tipos de serviço. Recarregue a página.");
      }
    };
    fetchTipos();
  }, [usuarioLogadoId]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "numeroPatrimonio") {
      const numbersOnly = value.replace(/\D/g, "").slice(0, 7);
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    setErrors((prev) => ({ ...prev, [name]: "" }));
    setSubmitError(null);
  };

  const buscarTecnicoAleatorio = async (tipoId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/poolTecnico/tecnicos/${tipoId}`
      );
      const tecnicos = response.data;
      if (tecnicos.length === 0) {
        throw new Error("Nenhum técnico disponível para este tipo de serviço");
      }
      return tecnicos[Math.floor(Math.random() * tecnicos.length)].id;
    } catch (error) {
      console.error("Erro ao buscar técnico:", error);
      throw error;
    }
  };

  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!formData.numeroPatrimonio || formData.numeroPatrimonio.length === 0) {
      newErrors.numeroPatrimonio = "O número de patrimônio é obrigatório.";
    } else if (formData.numeroPatrimonio.length > 7) {
      newErrors.numeroPatrimonio = "O número de patrimônio deve ter no máximo 7 dígitos.";
    }
    if (!formData.descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
    if (!formData.tipo_id) newErrors.tipo_id = "Selecione um tipo de serviço.";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      const tecnicoId = await buscarTecnicoAleatorio(formData.tipo_id);
      const patrimonioComZeros = formData.numeroPatrimonio.padStart(7, "0");

      const payload = {
        titulo: formData.titulo.trim(),
        patrimonio: patrimonioComZeros,
        descricao: formData.descricao.trim(),
        tipo_id: parseInt(formData.tipo_id, 10),
        tecnico_id: tecnicoId,
        usuario_id: usuarioLogadoId,
        estado: "pendente",
      };

      const response = await axios.post("http://localhost:8080/chamados", payload);
      setShowSuccess(true);
      setFormData({
        titulo: "",
        numeroPatrimonio: "",
        descricao: "",
        tipo_id: "",
      });
    } catch (error) {
      if (error.message === "Nenhum técnico disponível para este tipo de serviço") {
        setSubmitError("Nenhum técnico disponível para este tipo de serviço. Tente outro tipo ou entre em contato com o administrador.");
      } else if (error.response) {
        setSubmitError(`Erro: ${error.response.data.mensagem || "Erro no servidor."}`);
      } else if (error.request) {
        setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        setSubmitError("Erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  const handleLogout = async () => {
    try {
      await fetch("http://localhost:8080/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      window.location.href = "/";
    } catch (err) {
      console.error("Erro ao fazer logout:", err);
      setSubmitError("Erro ao fazer logout. Tente novamente.");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#FFFDF7] flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <>
      <Head>
        <title>Abrir Novo Chamado | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Registre chamados de manutenção para equipamentos escolares com agilidade e precisão."
        />
      </Head>
<div className="min-h-screen bg-[#FFFDF7] font-sans">
      <header className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-8 sm:py-12 px-4">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">
            Criar Chamados
          </h1>
          <p className="text-sm sm:text-base md:text-lg mb-6 sm:mb-8 max-w-3xl mx-auto text-[#FFFDF7]/90">
           Crie o seu chamado para que possamos ajudar a resolver o seu problema de forma rápida e eficiente.
          </p>
          <div className="flex gap-4">
  
          </div>
        </div>
      </header>

<br></br>
<br></br>
        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-[#2D3250] p-8 rounded-xl shadow-lg space-y-6 border-t-4 border-[#E31B23]"
        >
          <div>
            <label className="block text-[#FFFDF7] mb-2 font-medium">
              Título <span className="text-[#E31B23]">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              placeholder="Ex: Computador não liga"
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              disabled={isSubmitting}
            />
            {errors.titulo && <p className="text-red-400 mt-1 text-sm">{errors.titulo}</p>}
          </div>

          <div>
            <label className="block text-[#FFFDF7] mb-2 font-medium">
              Nº Patrimônio <span className="text-[#E31B23]">*</span>
            </label>
            <input
              type="text"
              name="numeroPatrimonio"
              value={formData.numeroPatrimonio}
              onChange={handleInputChange}
              placeholder="Ex: 1234567"
              maxLength="7"
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              disabled={isSubmitting}
            />
            <p className="text-[#FFFDF7]/60 text-xs mt-1">
              Até 7 dígitos numéricos (será completado com zeros à esquerda se necessário)
            </p>
            {errors.numeroPatrimonio && (
              <p className="text-red-400 mt-1 text-sm">{errors.numeroPatrimonio}</p>
            )}
          </div>

          <div>
            <label className="block text-[#FFFDF7] mb-2 font-medium">
              Descrição <span className="text-[#E31B23]">*</span>
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              placeholder="Descreva detalhadamente o problema..."
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              rows={4}
              disabled={isSubmitting}
            ></textarea>
            {errors.descricao && <p className="text-red-400 mt-1 text-sm">{errors.descricao}</p>}
          </div>

          <div>
            <label className="block text-[#FFFDF7] mb-2 font-medium">
              Tipo de Serviço <span className="text-[#E31B23]">*</span>
            </label>
            <select
              name="tipo_id"
              value={formData.tipo_id}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7] border border-[#1B1F3B] focus:border-[#E31B23] focus:outline-none"
              disabled={isSubmitting}
            >
              <option value="">Selecione o tipo de serviço</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.titulo.charAt(0).toUpperCase() + tipo.titulo.slice(1)}
                </option>
              ))}
            </select>
            <p className="text-[#FFFDF7]/60 text-xs mt-1">
              Um técnico será automaticamente atribuído baseado no tipo selecionado
            </p>
            {errors.tipo_id && <p className="text-red-400 mt-1 text-sm">{errors.tipo_id}</p>}
          </div>

          {submitError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
              {submitError}
            </div>
          )}

          <div className="flex justify-end gap-4 pt-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#FFFDF7]/20 text-[#FFFDF7] rounded-lg font-bold hover:bg-[#FFFDF7]/30 transition duration-300"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#E31B23] text-white rounded-lg font-bold hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed transition duration-300"
            >
              {isSubmitting ? "Enviando..." : "Abrir Chamado"}
            </button>
          </div>
        </form>

        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div className="bg-[#2D3250] text-[#FFFDF7] p-8 rounded-xl shadow-lg border-t-4 border-[#E31B23] text-center max-w-md mx-4">
              <div className="mb-4">
                <div className="mx-auto w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mb-4">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                  </svg>
                </div>
                <h3 className="text-2xl font-bold mb-2">Chamado Registrado!</h3>
                <p className="text-[#FFFDF7]/80 mb-6">
                  Seu chamado foi criado com sucesso e um técnico foi automaticamente atribuído. O chamado será processado em breve.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setShowSuccess(false)}
                  className="px-4 py-2 bg-[#FFFDF7]/20 text-[#FFFDF7] rounded-lg font-medium hover:bg-[#FFFDF7]/30 transition duration-300"
                >
                  Fechar
                </button>
                <Link
                  href="/meus-chamados"
                  className="px-4 py-2 bg-[#E31B23] rounded-lg font-medium text-white hover:bg-red-700 transition duration-300"
                >
                  Ver Meus Chamados
                </Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
