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
    tecnico_id: "",
  });

  // -------------------------------
  // Estados auxiliares
  // -------------------------------
  const [tipos, setTipos] = useState([]); // Lista de tipos de serviço
  const [tecnicosDisponiveis, setTecnicosDisponiveis] = useState([]); // Técnicos filtrados pelo tipo
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
        const response = await axios.get("http://localhost:8080/pool"); // API retorna os tipos de serviço
        setTipos(response.data);
      } catch (error) {
        console.error("Erro ao carregar tipos:", error);
        setTipos([]);
      }
    };
    fetchTipos();
  }, []);

  // -------------------------------
  // Função para buscar técnicos por tipo
  // -------------------------------
  const fetchTecnicosPorTipo = async (tipoId) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/pool_tecnico/tecnicos/${tipoId}` // <- nova rota
    );
    setTecnicosDisponiveis(response.data); // Array com {id, nome}
  } catch (error) {
    console.error("Erro ao buscar técnicos:", error);
    setTecnicosDisponiveis([]);
  }
};

  // -------------------------------
  // Atualiza o campo do formulário
  // -------------------------------
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" })); // Limpa erro do campo
    setSubmitError(null); // Limpa erro geral
  };

  // -------------------------------
  // Quando muda o tipo de serviço
  // -------------------------------
  const handleTipoChange = (e) => {
    const tipoId = e.target.value;
    setFormData((prev) => ({ ...prev, tipo_id: tipoId, tecnico_id: "" })); // Reset técnico
    fetchTecnicosPorTipo(tipoId); // Busca técnicos do tipo
    setErrors((prev) => ({ ...prev, tipo_id: "", tecnico_id: "" }));
  };

  // -------------------------------
  // Validação do formulário
  // -------------------------------
  const validateForm = () => {
    const newErrors = {};
    if (!formData.titulo.trim()) newErrors.titulo = "O título é obrigatório.";
    if (!formData.numeroPatrimonio.match(/^\d{1,7}$/))
      newErrors.numeroPatrimonio =
        "O número de patrimônio deve ter até 7 dígitos numéricos.";
    if (!formData.descricao.trim()) newErrors.descricao = "A descrição é obrigatória.";
    if (!formData.tipo_id) newErrors.tipo_id = "Selecione um tipo de serviço.";
    if (!formData.tecnico_id) newErrors.tecnico_id = "Selecione um técnico.";
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

    const nowISO = new Date().toISOString();

    // Adiciona zeros à esquerda para patrimonio
    const patrimonioComZeros = formData.numeroPatrimonio.padStart(7, "0");

    const payload = {
      titulo: formData.titulo,
      patrimonio: patrimonioComZeros,
      descricao: formData.descricao,
      tipo_id: parseInt(formData.tipo_id, 10),
      tecnico_id: parseInt(formData.tecnico_id, 10),
      usuario_id: 4, // fixo por enquanto
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
        tecnico_id: "",
      });
      setTecnicosDisponiveis([]);
    } catch (error) {
      console.error("Erro ao enviar chamado:", error);
      setSubmitError("Erro ao enviar chamado. Tente novamente mais tarde.");
    } finally {
      setIsSubmitting(false);
    }
  };

  // -------------------------------
  // Fecha mensagem de sucesso automaticamente
  // -------------------------------
  useEffect(() => {
    if (showSuccess) {
      const timer = setTimeout(() => setShowSuccess(false), 3000);
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
        <h1 className="text-4xl font-bold text-center mb-8">Abrir Novo Chamado</h1>

        <form
          onSubmit={handleSubmit}
          className="max-w-3xl mx-auto bg-[#2D3250] p-8 rounded-xl shadow-lg space-y-6 border-t-4 border-[#E31B23]"
        >
          {/* Título */}
          <div>
            <label className="block text-[#FFFDF7] mb-2">
              Título <span className="text-[#E31B23]">*</span>
            </label>
            <input
              type="text"
              name="titulo"
              value={formData.titulo}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7]"
              disabled={isSubmitting}
            />
            {errors.titulo && <p className="text-red-400 mt-1">{errors.titulo}</p>}
          </div>

          {/* Patrimônio */}
          <div>
            <label className="block text-[#FFFDF7] mb-2">
              Nº Patrimônio <span className="text-[#E31B23]">*</span>
            </label>
            <input
              type="text"
              name="numeroPatrimonio"
              value={formData.numeroPatrimonio}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7]"
              disabled={isSubmitting}
            />
            {errors.numeroPatrimonio && <p className="text-red-400 mt-1">{errors.numeroPatrimonio}</p>}
          </div>

          {/* Descrição */}
          <div>
            <label className="block text-[#FFFDF7] mb-2">
              Descrição <span className="text-[#E31B23]">*</span>
            </label>
            <textarea
              name="descricao"
              value={formData.descricao}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7]"
              rows={4}
              disabled={isSubmitting}
            ></textarea>
            {errors.descricao && <p className="text-red-400 mt-1">{errors.descricao}</p>}
          </div>

          {/* Tipo de Serviço */}
          <div>
            <label className="block text-[#FFFDF7] mb-2">
              Tipo de Serviço <span className="text-[#E31B23]">*</span>
            </label>
            <select
              name="tipo_id"
              value={formData.tipo_id}
              onChange={handleTipoChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7]"
              disabled={isSubmitting}
            >
              <option value="">Selecione o tipo</option>
              {tipos.map((tipo) => (
                <option key={tipo.id} value={tipo.id}>
                  {tipo.titulo}
                </option>
              ))}
            </select>
            {errors.tipo_id && <p className="text-red-400 mt-1">{errors.tipo_id}</p>}
          </div>

          {/* Técnico */}
          <div>
            <label className="block text-[#FFFDF7] mb-2">
              Técnico <span className="text-[#E31B23]">*</span>
            </label>
            <select
              name="tecnico_id"
              value={formData.tecnico_id}
              onChange={handleInputChange}
              className="w-full p-3 rounded-lg bg-[#1B1F3B] text-[#FFFDF7]"
              disabled={!formData.tipo_id || isSubmitting}
            >
              <option value="">Selecione um técnico</option>
              {tecnicosDisponiveis.map((tec) => (
                <option key={tec.id} value={tec.id}>
                  {tec.nome}
                </option>
              ))}
            </select>
            {errors.tecnico_id && <p className="text-red-400 mt-1">{errors.tecnico_id}</p>}
          </div>

          {/* Botões */}
          <div className="flex justify-end gap-4">
            <Link
              href="/"
              className="px-6 py-3 bg-[#FFFDF7]/20 text-[#FFFDF7] rounded-lg font-bold hover:bg-[#FFFDF7]/30"
            >
              Cancelar
            </Link>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-6 py-3 bg-[#E31B23] text-white rounded-lg font-bold hover:bg-red-700"
            >
              {isSubmitting ? "Enviando..." : "Abrir Chamado"}
            </button>
          </div>

          {submitError && <p className="text-red-400 mt-2">{submitError}</p>}
        </form>

        {/* Mensagem de sucesso */}
        {showSuccess && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-[#2D3250] text-[#FFFDF7] p-8 rounded-xl shadow-lg border-t-4 border-[#E31B23] text-center">
              <h3 className="text-2xl font-bold mb-2">Chamado registrado com sucesso!</h3>
              <Link
                href="/meus-chamados"
                className="px-6 py-3 bg-[#E31B23] rounded-lg font-bold text-white hover:bg-red-700"
              >
                Ver Meus Chamados
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
