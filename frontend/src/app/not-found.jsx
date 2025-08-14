import React from "react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-4 sm:p-6">
      <div className="flex flex-col items-center text-center text-black max-w-4xl w-full">
        <div className="relative flex flex-col items-center">
          <div className="flex flex-row items-center justify-center gap-2 sm:gap-8">
            <h1
              className="select-none font-extrabold leading-none text-[4.5rem] sm:text-[8rem] md:text-[10rem] lg:text-[14rem]"
              style={{
                background: "linear-gradient(to bottom, #FF0000, #000000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              404
            </h1>

            <img 
              src="/engrenagemquebrada.svg" 
              className="h-16 sm:h-32 md:h-40 lg:h-48 xl:h-[200px] w-auto" 
              alt="Engrenagem quebrada"
            />
          </div>

          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row gap-3 sm:gap-4 w-full sm:w-auto">
            <a
              href="/"
              className="px-4 sm:px-5 py-3 rounded-lg font-semibold text-white transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm sm:text-base"
              style={{
                background: "linear-gradient(to bottom, #FF0000, #000000)",
              }}
            >
              Voltar para a página inicial
            </a>
            <a
              href="/contato"
              className="px-4 sm:px-5 py-3 rounded-lg border-2 font-semibold transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500/50 bg-transparent text-sm sm:text-base"
              style={{
                borderImage: "linear-gradient(to bottom, #FF0000, #000000) 1",
                background: "linear-gradient(to bottom, #FF0000, #000000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              Contato
            </a>
          </div>
        </div>

        <div className="mt-8 sm:mt-10 max-w-md sm:max-w-lg">
          <h2 className="text-xl sm:text-2xl md:text-3xl font-semibold mb-3 sm:mb-4 px-2">
            Essa página que você está procurando não existe
          </h2>
          <p className="text-sm sm:text-base text-gray-600 leading-relaxed px-2">
            Pode ser que o link esteja incorreto, a página foi removida ou ainda não foi criada.
          </p>
        </div>
      </div>
    </main>
  );
}