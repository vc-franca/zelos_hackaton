"use client";

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#FFFDF7]">
      {/* Hero Section */}
      <section className="bg-[#1B1F3B] text-[#FFFDF7] py-24 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Sistema de Manutenção Escolar</h1>
          <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
            Solução completa para gestão de manutenção de equipamentos escolares com agilidade e eficiência
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/novo-chamado"
              className="bg-[#E31B23] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#C5161D] transition duration-300 text-lg shadow-lg"
            >
              Abrir Novo Chamado
            </Link>
            <Link
              href="/meus-chamados"
              className="bg-transparent border-2 border-[#FFFDF7] text-[#FFFDF7] px-8 py-4 rounded-lg font-bold hover:bg-[#FFFDF7] hover:text-[#1B1F3B] transition duration-300 text-lg"
            >
              Acompanhar Chamados
            </Link>
          </div>
        </div>
      </section>

      {/* Serviços Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-[#1B1F3B] mb-4">Nossos Serviços</h2>
            <div className="w-20 h-1 bg-[#E31B23] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#1B1F3B]">
              <h3 className="text-2xl font-bold mb-4 text-[#1B1F3B]">Registro de Chamados</h3>
              <p className="text-gray-700 mb-4">
                Reporte problemas em equipamentos escolares de forma rápida e organizada.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Computadores, projetores e equipamentos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Priorização automática por urgência</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Upload de fotos e documentos</span>
                </li>
              </ul>
            </div>

            {/* Card 2 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#1B1F3B]">
              <h3 className="text-2xl font-bold mb-4 text-[#1B1F3B]">Acompanhamento</h3>
              <p className="text-gray-700 mb-4">
                Monitoramento em tempo real do status de todos os seus chamados.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Notificações instantâneas</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Comunicação direta com técnicos</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Previsão de conclusão</span>
                </li>
              </ul>
            </div>

            {/* Card 3 */}
            <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#1B1F3B]">
              <h3 className="text-2xl font-bold mb-4 text-[#1B1F3B]">Histórico Completo</h3>
              <p className="text-gray-700 mb-4">
                Acesso a todo o histórico de manutenções realizadas.
              </p>
              <ul className="space-y-3">
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Relatórios detalhados</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Análise de histórico por equipamento</span>
                </li>
                <li className="flex items-start">
                  <span className="text-[#E31B23] mr-2">•</span>
                  <span>Exportação de dados</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Destaques Section */}
      <section className="bg-[#1B1F3B] text-[#FFFDF7] py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por Que Nosso Sistema?</h2>
            <div className="w-20 h-1 bg-[#E31B23] mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Destaque 1 */}
            <div className="text-center p-6">
              <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                1
              </div>
              <h3 className="text-xl font-bold mb-3">Rápido</h3>
              <p className="text-[#FFFDF7]/90">
                Tempo médio de atendimento 40% menor que o padrão do mercado
              </p>
            </div>

            {/* Destaque 2 */}
            <div className="text-center p-6">
              <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                2
              </div>
              <h3 className="text-xl font-bold mb-3">Organizado</h3>
              <p className="text-[#FFFDF7]/90">
                Todos os chamados e histórico centralizados em um só lugar
              </p>
            </div>

            {/* Destaque 3 */}
            <div className="text-center p-6">
              <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
                3
              </div>
              <h3 className="text-xl font-bold mb-3">Eficiente</h3>
              <p className="text-[#FFFDF7]/90">
                Redução de 60% em retrabalhos e chamados repetidos
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Chamados Recentes Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Seu Painel */}
            <div className="bg-white p-8 rounded-xl shadow-lg flex-1">
              <h3 className="text-2xl font-bold text-[#1B1F3B] mb-6 border-b pb-2">Seu Painel</h3>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-[#FFFDF7] p-4 rounded-lg border border-gray-200">
                  <p className="text-4xl font-bold text-[#1B1F3B] mb-2">7</p>
                  <p className="text-gray-700">Chamados este mês</p>
                </div>
                <div className="bg-[#FFFDF7] p-4 rounded-lg border border-gray-200">
                  <p className="text-4xl font-bold text-[#1B1F3B] mb-2">5</p>
                  <p className="text-gray-700">Concluídos</p>
                </div>
                <div className="bg-[#FFFDF7] p-4 rounded-lg border border-gray-200">
                  <p className="text-4xl font-bold text-[#1B1F3B] mb-2">1</p>
                  <p className="text-gray-700">Em andamento</p>
                </div>
                <div className="bg-[#FFFDF7] p-4 rounded-lg border border-gray-200">
                  <p className="text-4xl font-bold text-[#1B1F3B] mb-2">1</p>
                  <p className="text-gray-700">Aguardando</p>
                </div>
              </div>
            </div>

            {/* Últimos Chamados */}
            <div className="bg-white p-8 rounded-xl shadow-lg flex-1">
              <div className="flex justify-between items-center mb-6 border-b pb-2">
                <h3 className="text-2xl font-bold text-[#1B1F3B]">Últimos Chamados</h3>
                <Link href="/meus-chamados" className="text-[#E31B23] font-medium hover:underline">
                  Ver todos →
                </Link>
              </div>
              <div className="space-y-4">
                <div className="border-b pb-4">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-lg text-[#1B1F3B]">Computador - Lab 3</h4>
                    <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full text-sm font-medium">Em andamento</span>
                  </div>
                  <p className="text-gray-600 mt-2">Problema: Não inicia - Patrimônio #12345</p>
                  <p className="text-sm text-gray-500 mt-1">Aberto em: 15/06/2023</p>
                </div>
                <div className="border-b pb-4">
                  <div className="flex justify-between">
                    <h4 className="font-bold text-lg text-[#1B1F3B]">Projetor - Sala 12</h4>
                    <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-medium">Concluído</span>
                  </div>
                  <p className="text-gray-600 mt-2">Problema: Imagem distorcida - Patrimônio #67890</p>
                  <p className="text-sm text-gray-500 mt-1">Concluído em: 10/06/2023</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="bg-[#E31B23] text-white py-16 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Precisa de suporte técnico?</h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Nossa equipe especializada está pronta para resolver seus problemas com equipamentos escolares
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link
              href="/novo-chamado"
              className="bg-[#1B1F3B] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#1B1F3B]/90 transition duration-300 text-lg shadow-lg"
            >
              Abrir Chamado Agora
            </Link>
            <Link
              href="/contato"
              className="bg-white text-[#E31B23] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-lg"
            >
              Falar com Suporte
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}