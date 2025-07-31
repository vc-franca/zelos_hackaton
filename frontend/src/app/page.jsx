"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Seção Hero */}
      <section className="bg-[#004aad] text-white py-20 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sistema de Chamados Técnicos Escolares</h1>
          <p className="text-xl md:text-2xl mb-8">
            Solução completa para registro e acompanhamento de manutenções de equipamentos escolares
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/novo-chamado"
              className="bg-white text-[#004aad] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-lg shadow-md"
            >
              Registrar Novo Chamado
            </Link>
            <Link
              href="/meus-chamados"
              className="bg-transparent border-2 border-white px-8 py-4 rounded-lg font-bold hover:bg-white hover:text-[#004aad] transition duration-300 text-lg shadow-md"
            >
              Acompanhar Meus Chamados
            </Link>
          </div>
        </div>
      </section>

      {/* Seção de Serviços */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#004aad]">Nossos Serviços de Manutenção</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card Manutenção */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#004aad]">
              <h3 className="text-2xl font-bold mb-4 text-[#004aad]">Manutenção Técnica</h3>
              <p className="text-gray-700 mb-4">
                Registre problemas em equipamentos como computadores, projetores, impressoras e outros dispositivos da escola.
                Nossa equipe especializada realiza diagnósticos precisos e soluções eficientes.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Reparo de hardware e software</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Atendimento prioritário para equipamentos críticos</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Serviços preventivos e corretivos</span>
                </li>
              </ul>
            </div>

            {/* Card Acompanhamento */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#004aad]">
              <h3 className="text-2xl font-bold mb-4 text-[#004aad]">Gestão de Chamados</h3>
              <p className="text-gray-700 mb-4">
                Acompanhe todo o ciclo de vida dos seus chamados, desde a abertura até a solução completa.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Notificações em tempo real sobre status</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Comunicação direta com os técnicos</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Priorização automática por urgência</span>
                </li>
              </ul>
            </div>

            {/* Card Histórico */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#004aad]">
              <h3 className="text-2xl font-bold mb-4 text-[#004aad]">Histórico Completo</h3>
              <p className="text-gray-700 mb-4">
                Acesso detalhado a todo o histórico de manutenções realizadas nos equipamentos.
              </p>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Relatórios completos de serviços</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Análise de histórico de problemas</span>
                </li>
                <li className="flex items-start">
                  <span className="inline-block w-2 h-2 bg-[#004aad] rounded-full mt-2 mr-2"></span>
                  <span>Documentação técnica organizada</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Processo */}
      <section className="bg-gray-100 py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12 text-[#004aad]">Como Registrar um Chamado</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Passo 1 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-[#004aad] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#004aad]">Identificação</h3>
              <p className="text-gray-700">
                Informe o número de patrimônio ou descreva o equipamento com problema. Especifique o tipo de serviço necessário com detalhes relevantes.
              </p>
            </div>

            {/* Passo 2 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-[#004aad] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#004aad]">Triagem Técnica</h3>
              <p className="text-gray-700">
                Nossa equipe analisará seu chamado, classificará por prioridade e designará o técnico mais adequado para a solução.
              </p>
            </div>

            {/* Passo 3 */}
            <div className="bg-white p-6 rounded-lg shadow-md text-center">
              <div className="bg-[#004aad] text-white w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-4 text-xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3 text-[#004aad]">Solução e Feedback</h3>
              <p className="text-gray-700">
                Receba notificações sobre cada etapa e, ao final, um relatório completo do serviço realizado e orientações para prevenção.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção de Destaques */}
      <section className="py-16 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Chamados Recentes */}
            <div className="bg-white p-8 rounded-xl shadow-lg">
              <h3 className="text-2xl font-bold mb-6 text-[#004aad] border-b pb-2">Seus Últimos Chamados</h3>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">Computador - Laboratório 3</h4>
                    <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-medium">Em andamento</span>
                  </div>
                  <p className="text-gray-600 mt-1">Problema: Não inicia - Aberto em 15/06/2023</p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex justify-between items-start">
                    <h4 className="font-bold text-lg">Projetor - Sala 12</h4>
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-medium">Concluído</span>
                  </div>
                  <p className="text-gray-600 mt-1">Problema: Imagem distorcida - Resolvido em 10/06/2023</p>
                </div>
              </div>
              <Link href="/meus-chamados" className="text-[#004aad] font-bold mt-6 inline-block hover:underline">
                Visualizar todos os meus chamados →
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Seção CTA Final */}
      <section className="bg-[#004aad] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Precisa de suporte técnico?</h2>
          <p className="text-xl md:text-2xl mb-8">
            Nossa equipe está pronta para resolver seus problemas com equipamentos escolares de forma ágil e profissional.
          </p>
          <Link
            href="/novo-chamado"
            className="bg-white text-[#004aad] px-10 py-4 rounded-lg font-bold hover:bg-gray-100 transition duration-300 inline-block text-lg shadow-lg"
          >
            Solicitar Atendimento Técnico
          </Link>
        </div>
      </section>
    </div>
  );
}