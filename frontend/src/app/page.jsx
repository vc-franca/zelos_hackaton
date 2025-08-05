"use client";

import Link from "next/link";
import Head from "next/head";

// Componente reutilizável para Cards de Serviços
const ServiceCard = ({ title, description, items }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 border-[#1B1F3B] animate-slide-up">
    <h3 className="text-2xl font-bold mb-4 text-[#1B1F3B]">{title}</h3>
    <p className="text-gray-700 mb-4">{description}</p>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-[#E31B23] mr-2">•</span>
          <span>{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

// Componente reutilizável para Destaques
const HighlightCard = ({ number, title, description }) => (
  <div className="text-center p-6 animate-slide-up">
    <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 text-2xl font-bold">
      {number}
    </div>
    <h3 className="text-xl font-bold mb-3">{title}</h3>
    <p className="text-[#FFFDF7]/90">{description}</p>
  </div>
);

// Componente reutilizável para Equipamentos
const EquipmentCard = ({ title, icon }) => (
  <div className="bg-white p-6 rounded-xl shadow-md text-center hover:shadow-lg transition duration-300 animate-slide-up">
    <div className="bg-[#FFFDF7] w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center">
      {icon}
    </div>
    <h3 className="font-bold text-lg text-[#1B1F3B]">{title}</h3>
  </div>
);

// Componente reutilizável para Depoimentos
const TestimonialCard = ({ initials, name, role, text }) => (
  <div className="bg-white p-8 rounded-xl shadow-lg animate-slide-up">
    <div className="flex items-center mb-4">
      <div className="bg-[#E31B23] text-white w-12 h-12 rounded-full flex items-center justify-center font-bold mr-4">{initials}</div>
      <div>
        <h4 className="font-bold text-lg">{name}</h4>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 italic">{text}</p>
    <div className="flex mt-4 text-yellow-400">
      {[...Array(5)].map((_, i) => (
        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 20 20" aria-label="Estrela de avaliação">
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
        </svg>
      ))}
    </div>
  </div>
);

export default function HomePage() {
  return (
    <>
      <Head>
        <title>Sistema de Manutenção Escolar | Gestão Eficiente</title>
        <meta name="description" content="Solução completa para gestão de manutenção de equipamentos escolares com agilidade e eficiência." />
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
        .animate-slide-up {
          animation: slide-up 0.5s ease-out forwards;
        }
        @media (max-width: 768px) {
          .testimonials-container {
            display: flex;
            overflow-x: auto;
            scroll-snap-type: x mandatory;
            gap: 1rem;
            padding-bottom: 1rem;
          }
          .testimonials-container > div {
            flex: 0 0 90%;
            scroll-snap-align: start;
          }
        }
      `}</style>
      <div className="min-h-screen bg-[#FFFDF7] font-sans">
        {/* Floating Action Button */}
        <Link
          href="/novo-chamado"
          className="fixed bottom-6 right-6 bg-[#E31B23] text-white p-4 rounded-full shadow-lg hover:bg-[#C5161D] transition duration-300 z-50"
          aria-label="Abrir novo chamado"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
          </svg>
        </Link>

        {/* Hero Section */}
        <section className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7] py-24 px-4">
          <div className="max-w-6xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 animate-slide-up">Sistema de Manutenção Escolar</h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Solução completa para gestão de manutenção de equipamentos escolares com agilidade e eficiência
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/novo-chamado"
                className="bg-[#E31B23] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#C5161D] transition duration-300 text-lg shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23]"
                aria-label="Abrir novo chamado"
              >
                Abrir Novo Chamado
              </Link>
              <Link
                href="/meus-chamados"
                className="bg-transparent border-2 border-[#FFFDF7] text-[#FFFDF7] px-8 py-4 rounded-lg font-bold hover:bg-[#FFFDF7] hover:text-[#1B1F3B] transition duration-300 text-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFDF7]"
                aria-label="Acompanhar chamados"
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
              <h2 className="text-3xl font-bold text-[#1B1F3B] mb-4 animate-slide-up">Nossos Serviços</h2>
              <div className="w-20 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <ServiceCard
                title="Registro de Chamados"
                description="Reporte problemas em equipamentos escolares de forma rápida e organizada."
                items={["Computadores, projetores e equipamentos", "Priorização automática por urgência", "Upload de fotos e documentos"]}
              />
              <ServiceCard
                title="Acompanhamento"
                description="Monitoramento em tempo real do status de todos os seus chamados."
                items={["Notificações instantâneas", "Comunicação direta com técnicos", "Previsão de conclusão"]}
              />
              <ServiceCard
                title="Histórico Completo"
                description="Acesso a todo o histórico de manutenções realizadas."
                items={["Relatórios detalhados", "Análise de histórico por equipamento", "Exportação de dados"]}
              />
            </div>
          </div>
        </section>

        {/* Destaques Section */}
        <section className="bg-[#1B1F3B] text-[#FFFDF7] py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold mb-4 animate-slide-up">Por Que Nosso Sistema?</h2>
              <div className="w-20 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HighlightCard
                number="1"
                title="Rápido"
                description="Tempo médio de atendimento 40% menor que o padrão do mercado"
              />
              <HighlightCard
                number="2"
                title="Organizado"
                description="Todos os chamados e histórico centralizados em um só lugar"
              />
              <HighlightCard
                number="3"
                title="Eficiente"
                description="Redução de 60% em retrabalhos e chamados repetidos"
              />
            </div>
          </div>
        </section>

        {/* Equipamentos Atendidos Section */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1B1F3B] mb-4 animate-slide-up">Equipamentos Atendidos</h2>
              <div className="w-20 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <EquipmentCard
                title="Computadores"
                icon={
                  <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Ícone de computador">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
              />
              <EquipmentCard
                title="Projetores"
                icon={
                  <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Ícone de projetor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
              />
              <EquipmentCard
                title="Impressoras"
                icon={
                  <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Ícone de impressora">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
              />
              <EquipmentCard
                title="Tablets"
                icon={
                  <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-label="Ícone de tablet">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
              />
            </div>
          </div>
        </section>

        {/* Depoimentos Section */}
        <section className="bg-[#F5F5F5] py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#1B1F3B] mb-4 animate-slide-up">O Que Dizem Nossos Usuários</h2>
              <div className="w-20 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            <div className="testimonials-container grid grid-cols-1 md:grid-cols-2 gap-8 md:overflow-hidden">
              <TestimonialCard
                initials="JP"
                name="Joana Pereira"
                role="Professora de Informática"
                text="O sistema revolucionou como lidamos com manutenções na escola. Antes levávamos dias para resolver um problema simples, agora em poucas horas temos resposta."
              />
              <TestimonialCard
                initials="MC"
                name="Marcos Costa"
                role="Coordenador Pedagógico"
                text="A transparência no acompanhamento dos chamados nos permite planejar melhor as aulas, sabendo exatamente quando os equipamentos estarão disponíveis."
              />
              <TestimonialCard
                initials="AF"
                name="Ana Ferreira"
                role="Diretora"
                text="A organização e rapidez do sistema nos ajudaram a reduzir custos e melhorar a qualidade do ensino."
              />
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-[#E31B23] to-[#C5161D] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 animate-slide-up">Precisa de suporte técnico?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: "0.2s" }}>
              Nossa equipe especializada está pronta para resolver seus problemas com equipamentos escolares
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link
                href="/novo-chamado"
                className="bg-[#1B1F3B] text-white px-8 py-4 rounded-lg font-bold hover:bg-[#1B1F3B]/90 transition duration-300 text-lg shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#1B1F3B]"
                aria-label="Abrir chamado agora"
              >
                Abrir Chamado Agora
              </Link>
              <Link
                href="/contato"
                className="bg-white text-[#E31B23] px-8 py-4 rounded-lg font-bold hover:bg-gray-100 transition duration-300 text-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23]"
                aria-label="Falar com suporte"
              >
                Falar com Suporte
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}