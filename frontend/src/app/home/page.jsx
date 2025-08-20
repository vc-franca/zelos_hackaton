'use client';

import Link from "next/link";
import Head from "next/head";
import { useEffect } from "react";

const ServiceCard = ({ title, description, items, icon, gradient }) => (
  <div className={`p-8 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border-t-4 ${gradient} sr-slide-up`}>
    <div className="flex items-center mb-4">
      <div className="bg-white/20 p-3 rounded-lg mr-4">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-white">{title}</h3>
    </div>
    <p className="text-white/90 mb-4">{description}</p>
    <ul className="space-y-3">
      {items.map((item, index) => (
        <li key={index} className="flex items-start">
          <span className="text-[#FFD700] mr-2">•</span>
          <span className="text-white/90">{item}</span>
        </li>
      ))}
    </ul>
  </div>
);

const HighlightCard = ({ number, title, description, icon, gradient }) => (
  <div className="text-center p-8 rounded-2xl shadow-2xl hover:scale-105 transition duration-300 sr-slide-up">
    <div className={`${gradient} p-8 rounded-2xl mb-6`}>
      <div className="bg-white/20 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4">
        {icon}
      </div>
      <div className="bg-[#E31B23] text-white w-16 h-16 rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
        {number}
      </div>
    </div>
    <h3 className="text-2xl font-bold mb-4 text-gray-200">{title}</h3>
    <p className="text-gray-200 leading-relaxed text-base sm:text-lg font-medium">{description}</p>
  </div>
);

const EquipmentCard = ({ title, icon, features, status }) => (
  <div className="bg-gradient-to-br from-white to-gray-50 p-8 rounded-2xl shadow-lg text-center hover:shadow-2xl transition duration-300 sr-slide-up border border-gray-100">
    <div className="bg-gradient-to-br from-[#E31B23] to-[#C5161D] w-20 h-20 mx-auto mb-6 rounded-2xl flex items-center justify-center shadow-lg">
      <div className="text-white text-3xl">
        {icon}
      </div>
    </div>
    <h3 className="font-bold text-xl text-[#1B1F3B] mb-4">{title}</h3>
    <div className="space-y-3 mb-6">
      {features.map((feature, index) => (
        <div key={index} className="flex items-center justify-center text-sm text-gray-600">
          <span className="text-[#E31B23] mr-2">✓</span>
          {feature}
        </div>
      ))}
    </div>
    <div className={`inline-block px-4 py-2 rounded-full text-xs font-semibold ${
      status === 'ativo' ? 'bg-green-100 text-green-800' : 
      status === 'manutenção' ? 'bg-yellow-100 text-yellow-800' : 
      'bg-red-100 text-red-800'
    }`}>
      {status}
    </div>
  </div>
);

const TestimonialCard = ({ initials, name, role, text, rating }) => (
  <div className="bg-white p-8 rounded-2xl shadow-lg hover:shadow-xl transition duration-300">
    <div className="flex items-center mb-6">
      <div className="bg-gradient-to-br from-[#E31B23] to-[#C5161D] text-white w-16 h-16 rounded-2xl flex items-center justify-center font-bold mr-4 shadow-lg">
        {initials}
      </div>
      <div>
        <h4 className="font-bold text-xl text-black">{name}</h4>
        <p className="text-gray-600">{role}</p>
      </div>
    </div>
    <p className="text-gray-700 italic text-lg leading-relaxed mb-6">{text}</p>
    <div className="flex items-center">
      <div className="flex text-yellow-400 mr-4">
        {[...Array(5)].map((_, i) => (
          <svg key={i} className="w-6 h-6 fill-current" viewBox="0 0 20 20" aria-label="Estrela de avaliação">
            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
          </svg>
        ))}
      </div>
      <span className="text-gray-500 font-semibold">{rating}/5</span>
    </div>
  </div>
);

export default function HomePage() {
  useEffect(() => {
    import("scrollreveal").then((ScrollReveal) => {
      const sr = ScrollReveal.default({
        distance: '20px',
        duration: 500,
        easing: 'ease-out',
        origin: 'bottom',
        reset: false,
        viewFactor: 0.2,
      });

      sr.reveal('.sr-slide-up', { interval: 150 });
    });
  }, []);

  return (
    <>
      <Head>
        <title>Sistema de Manutenção Escolar | Gestão Eficiente</title>
        <meta name="description" content="Solução completa para gestão de manutenção de equipamentos escolares com agilidade e eficiência." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>

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
        <section className="bg-gradient-to-b from-[#1B1F3B] to-[#2D3250] text-[#FFFDF7]">
          <div className="mx-auto text-center">
            <div className="relative w-full max-w-[1920px] h-[400px] sm:h-[500px] md:h-[600px] lg:h-[700px] overflow-hidden rounded-lg shadow-inner mx-auto">
              <video src="/backgroundhero.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover z-0" />
              <div className="absolute inset-0 bg-black bg-opacity-50 z-10" />

              <div className="relative z-20 flex flex-col justify-center items-center h-full px-4">
                <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold mb-6 sr-slide-up">
                  Sistema de Manutenção Escolar
                </h1>
                <p className="text-base sm:text-lg md:text-xl lg:text-2xl mb-8 max-w-3xl sr-slide-up" style={{ animationDelay: "0.2s" }}>
                  Solução completa para gestão de manutenção de equipamentos escolares com agilidade e eficiência
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4 px-4 w-full sm:w-auto sr-slide-up">
                  <Link
                    href="/novo-chamado"
                    className="bg-[#E31B23] text-white px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold hover:bg-[#C5161D] transition duration-300 text-base sm:text-lg shadow-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#E31B23] text-center"
                    aria-label="Abrir novo chamado"
                  >
                    Abrir Novo Chamado
                  </Link>
                  <Link
                    href="/meus-chamados"
                    className="bg-transparent border-2 border-[#FFFDF7] text-[#FFFDF7] px-6 py-3 sm:px-8 sm:py-4 rounded-lg font-bold hover:bg-[#FFFDF7] hover:text-[#1B1F3B] transition duration-300 text-base sm:text-lg focus:ring-2 focus:ring-offset-2 focus:ring-[#FFFDF7] text-center"
                    aria-label="Acompanhar chamados"
                  >
                    Acompanhar Chamados
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Serviços Section */}
        <section className="py-20 px-4">
          <div className="max-w-8xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1B1F3B] mb-4 sr-slide-up">Nossos Serviços</h2>
              <div className="w-24 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
              {/* Cards de Serviços */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <ServiceCard
                  title="Registro de Chamados"
                  description="Reporte problemas em equipamentos escolares de forma rápida e organizada."
                  items={["Computadores, projetores e equipamentos", "Priorização automática por urgência", "Upload de fotos e documentos"]}
                  icon={
                    <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-[#1B1F3B] to-[#2D3250]"
                />
                <ServiceCard
                  title="Acompanhamento"
                  description="Monitoramento em tempo real do status de todos os seus chamados."
                  items={["Notificações instantâneas", "Comunicação direta com técnicos", "Previsão de conclusão"]}
                  icon={
                    <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-[#2D3250] to-[#424769]"
                />
                <ServiceCard
                  title="Histórico Completo"
                  description="Acesso a todo o histórico de manutenções realizadas."
                  items={["Relatórios detalhados", "Análise de histórico por equipamento", "Exportação de dados"]}
                  icon={
                    <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-[#424769] to-[#676F9D]"
                />
                <ServiceCard
                  title="Suporte Técnico"
                  description="Equipe especializada para resolver problemas complexos."
                  items={["Técnicos certificados", "Atendimento 24/7", "Soluções personalizadas"]}
                  icon={
                    <svg className="w-8 h-8 text-[#E31B23]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192L5.636 18.364M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-5 0a4 4 0 11-8 0 4 4 0 018 0z" />
                    </svg>
                  }
                  gradient="bg-gradient-to-br from-[#676F9D] to-[#8B9DC3]"
                />
              </div>
              
              {/* Imagem Placeholder */}
              <div className="hidden lg:block">
                <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2D3250] p-8 rounded-2xl shadow-2xl h-full min-h-[600px] flex items-center justify-center">
                  <div className="bg-white/10 w-full h-full rounded-xl flex items-center justify-center">
                    <div className="text-center text-white">
                      <svg className="w-24 h-24 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p className="text-xl font-semibold">Sistema Integrado</p>
                      <p className="text-white/70">Interface moderna e intuitiva</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Destaques Section */}
        <section className="bg-gradient-to-br from-[#1B1F3B] via-[#2D3250] to-[#424769] text-[#FFFDF7] py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold mb-6 sr-slide-up">Por Que Nosso Sistema?</h2>
              <div className="w-24 h-1 bg-[#E31B23] mx-auto mb-8"></div>
              <p className="text-xl text-white max-w-3xl mx-auto font-medium">
                Desenvolvido com tecnologia de ponta para oferecer a melhor experiência em gestão de manutenção escolar
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <HighlightCard
                number="1"
                title="Rápido e Eficiente"
                description="Tempo médio de atendimento 40% menor que o padrão do mercado, com resposta em tempo real"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                }
                gradient="bg-gradient-to-br from-[#E31B23] to-[#C5161D]"
              />
              <HighlightCard
                number="2"
                title="Organizado e Centralizado"
                description="Todos os chamados e histórico centralizados em um só lugar com interface intuitiva"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                }
                gradient="bg-gradient-to-br from-[#1B1F3B] to-[#2D3250]"
              />
              <HighlightCard
                number="3"
                title="Inteligente e Preventivo"
                description="Redução de 60% em retrabalhos e chamados repetidos com análise preditiva"
                icon={
                  <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                }
                gradient="bg-gradient-to-br from-[#424769] to-[#676F9D]"
              />
            </div>
          </div>
        </section>

        {/* Equipamentos Atendidos Section */}
        <section className="py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1B1F3B] mb-4 sr-slide-up">Equipamentos Atendidos</h2>
              <div className="w-24 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              <EquipmentCard
                title="Computadores"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                }
                features={["Manutenção preventiva", "Atualizações de software", "Limpeza e higienização"]}
                status="ativo"
              />
              <EquipmentCard
                title="Projetores"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" />
                  </svg>
                }
                features={["Troca de lâmpadas", "Calibração de cores", "Limpeza de lentes"]}
                status="ativo"
              />
              <EquipmentCard
                title="Impressoras"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                  </svg>
                }
                features={["Troca de toners", "Limpeza de cabeçotes", "Configuração de rede"]}
                status="manutenção"
              />
              <EquipmentCard
                title="Tablets"
                icon={
                  <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                }
                features={["Atualizações de sistema", "Instalação de apps", "Configuração de rede"]}
                status="ativo"
              />
            </div>
          </div>
        </section>

        {/* Depoimentos Section */}
        <section className="bg-[#F5F5F5] py-20 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold text-[#1B1F3B] mb-4 sr-slide-up">O Que Dizem Nossos Usuários</h2>
              <div className="w-24 h-1 bg-[#E31B23] mx-auto"></div>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
              {/* Imagem Representativa */}
              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#1B1F3B] to-[#2D3250] p-8 rounded-2xl shadow-2xl text-center h-full min-h-[500px] flex flex-col justify-center">
                  <div className="bg-white/10 w-full h-80 rounded-xl flex items-center justify-center mb-6">
                    <div className="text-center text-white">
                      <svg className="w-20 h-20 mx-auto mb-4 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                      <p className="text-lg font-semibold">Depoimentos Reais</p>
                      <p className="text-white/70">De quem usa nosso sistema</p>
                    </div>
                  </div>
                  <div className="text-center">
                    <h3 className="text-2xl font-bold text-white mb-2">+500</h3>
                    <p className="text-white/80">Usuários satisfeitos</p>
                  </div>
                </div>
              </div>
              
              {/* Cards de Depoimentos */}
              <div className="lg:col-span-2 space-y-6">
                <TestimonialCard
                  initials="JP"
                  name="Joana Pereira"
                  role="Professora de Informática"
                  text="O sistema revolucionou como lidamos com manutenções na escola. Antes levávamos dias para resolver um problema simples, agora em poucas horas temos resposta."
                  rating={5}
                />
                <TestimonialCard
                  initials="MC"
                  name="Marcos Costa"
                  role="Coordenador Pedagógico"
                  text="A transparência no acompanhamento dos chamados nos permite planejar melhor as aulas, sabendo exatamente quando os equipamentos estarão disponíveis."
                  rating={5}
                />
                <TestimonialCard
                  initials="AF"
                  name="Ana Ferreira"
                  role="Diretora"
                  text="A organização e rapidez do sistema nos ajudaram a reduzir custos e melhorar a qualidade do ensino."
                  rating={5}
                />
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="bg-gradient-to-r from-[#E31B23] to-[#C5161D] text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-6 sr-slide-up">Precisa de suporte técnico?</h2>
            <p className="text-xl mb-8 max-w-2xl mx-auto sr-slide-up" style={{ animationDelay: "0.2s" }}>
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
