"use client";

import Link from "next/link";
import Head from "next/head";
import { useState, useEffect } from "react";
import axios from "axios";

export default function NovoChamado() {
  // -------------------------------
  // Estado do formulário
  // -------------------------------
  const [formData, setFormData] = useState({
    titulo: "",
    numeroPatrimonio: "",
    descricao: "",
    tipo_id: "",
  });

  // -------------------------------
  // Estados auxiliares
  // -------------------------------
  const [tipos, setTipos] = useState([]); // Lista de tipos de serviço
  const [errors, setErrors] = useState({}); // Mensagens de erro do formulário
  const [isSubmitting, setIsSubmitting] = useState(false); // Indica envio
  const [showSuccess, setShowSuccess] = useState(false); // Sucesso no envio
  const [submitError, setSubmitError] = useState(null); // Erro geral no envio

  // -------------------------------
  // Buscar tipos de serviço ao carregar a página
  // -------------------------------
  useEffect(() => {
    const fetchTipos = async () => {
      try {
        const response = await axios.get("http://localhost:8080/pool");
        console.log("Tipos carregados:", response.data);
        setTipos(response.data);
      } catch (error) {
        console.error("Erro ao carregar tipos:", error);
        setTipos([]);
        setSubmitError("Erro ao carregar tipos de serviço. Recarregue a página.");
      }
    };
    fetchTipos();
  }, []);

  // -------------------------------
  // Atualiza o campo do formulário
  // -------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Validação especial para número de patrimônio
    if (name === "numeroPatrimonio") {
      // Permite apenas números e limita a 7 dígitos
      const numbersOnly = value.replace(/\D/g, "").slice(0, 7);
      setFormData((prev) => ({ ...prev, [name]: numbersOnly }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
    
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpa erro do campo
    setSubmitError(null); // Limpa erro geral
  };

  // -------------------------------
  // Função para buscar técnico aleatório por tipo
  // -------------------------------
  const buscarTecnicoAleatorio = async (tipoId) => {
    try {
      const response = await axios.get(
        `http://localhost:8080/poolTecnico/tecnicos/${tipoId}`
      );
      
      const tecnicos = response.data;
      if (tecnicos.length === 0) {
        throw new Error("Nenhum técnico disponível para este tipo de serviço");
      }
      
      // Seleciona um técnico aleatório
      const tecnicoAleatorio = tecnicos[Math.floor(Math.random() * tecnicos.length)];
      return tecnicoAleatorio.id;
      
    } catch (error) {
      console.error("Erro ao buscar técnico:", error);
      throw error;
    }
  };

  // -------------------------------
  // Validação do formulário
  // -------------------------------
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.titulo.trim()) {
      newErrors.titulo = "O título é obrigatório.";
    }
    
    if (!formData.numeroPatrimonio || formData.numeroPatrimonio.length === 0) {
      newErrors.numeroPatrimonio = "O número de patrimônio é obrigatório.";
    } else if (formData.numeroPatrimonio.length > 7) {
      newErrors.numeroPatrimonio = "O número de patrimônio deve ter no máximo 7 dígitos.";
    }
    
    if (!formData.descricao.trim()) {
      newErrors.descricao = "A descrição é obrigatória.";
    }
    
    if (!formData.tipo_id) {
      newErrors.tipo_id = "Selecione um tipo de serviço.";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // -------------------------------
  // Envio do formulário
  // -------------------------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Busca um técnico aleatório para o tipo selecionado
      const tecnicoId = await buscarTecnicoAleatorio(formData.tipo_id);

      // Adiciona zeros à esquerda para patrimônio
      const patrimonioComZeros = formData.numeroPatrimonio.padStart(7, "0");

      const payload = {
        titulo: formData.titulo.trim(),
        patrimonio: patrimonioComZeros,
        descricao: formData.descricao.trim(),
        tipo_id: parseInt(formData.tipo_id, 10),
        tecnico_id: tecnicoId,
        usuario_id: 4, // fixo por enquanto - pode ser dinâmico no futuro
        estado: "pendente"
      };

      console.log("Enviando payload:", payload);

      const response = await axios.post("http://localhost:8080/chamados", payload);
      console.log("Chamado criado com sucesso:", response.data);
      
      setShowSuccess(true);
      setFormData({
        titulo: "",
        numeroPatrimonio: "",
        descricao: "",
        tipo_id: "",
      });
    } catch (error) {
      console.error("Erro ao enviar chamado:", error);
      
      if (error.message === "Nenhum técnico disponível para este tipo de serviço") {
        setSubmitError("Nenhum técnico disponível para este tipo de serviço. Tente outro tipo ou entre em contato com o administrador.");
      } else if (error.response) {
        // Erro do servidor
        const errorMessage = error.response.data.mensagem || "Erro no servidor.";
        setSubmitError(`Erro: ${errorMessage}`);
      } else if (error.request) {
        // Erro de rede
        setSubmitError("Erro de conexão. Verifique sua internet e tente novamente.");
      } else {
        // Outro erro
        setSubmitError("Erro inesperado. Tente novamente mais tarde.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------
  // Fecha mensagem de sucesso automaticamente
  // -------------------------------
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [showSuccess]);

  // -------------------------------
  // Renderização do formulário
  // -------------------------------
  return (
    <>
      <Head>
        <title>Abrir Novo Chamado | Sistema de Manutenção Escolar</title>
        <meta
          name="description"
          content="Registre chamados de manutenção para equipamentos escolares com agilidade e precisão."
        />
      </Head>

      <div className="min-h-screen bg-[#FFFDF7] font-sans px-4 py-10">
        <h1 className="text-4xl font-bold text-center mb-8 text-[#1B1F3B]">Abrir Novo Chamado</h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-[#2D3250] p-8 rounded-xl shadow-lg space-y-6 border-t-4 border-[#E31B23]"
        >
          {/* Título */}
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

          {/* Patrimônio */}
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
            {errors.numeroPatrimonio && <p className="text-red-400 mt-1 text-sm">{errors.numeroPatrimonio}</p>}
          </div>

          {/* Descrição */}
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

          {/* Tipo de Serviço */}
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

          {/* Erro geral */}
          {submitError && (
            <div className="bg-red-500/20 border border-red-500 text-red-300 p-3 rounded-lg">
              {submitError}
            </div>
          )}

          {/* Botões */}
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

        {/* Mensagem de sucesso */}
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