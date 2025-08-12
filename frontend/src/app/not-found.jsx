import React from "react";

export default function NotFound404() {
  return (
    <main className="min-h-screen bg-white flex items-center justify-center p-6">
      <div className="flex flex-col items-center text-center text-black">
        {/* 404 number with gradient style matching gear SVG */}
        <div className="relative flex flex-col items-center">
          <div className="flex items-center justify-center gap-8">
            <h1
              className="select-none font-extrabold leading-none text-[10rem] md:text-[14rem]"
              style={{
                background: "linear-gradient(to bottom, #FF0000, #000000)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent"
              }}
            >
              404
            </h1>

            {/* Placeholder for broken gear image */}
            <img src="/engrenagemquebrada.svg" className="h-[200]" />
          </div>

          {/* Buttons under 404 */}
          <div className="mt-8 flex gap-4">
            <a
              href="/"
              className="px-5 py-3 rounded-lg border border-red-700 text-red-700 bg-red-100 hover:bg-red-200 transition"
            >
              Voltar para a página inicial
            </a>
            <a
              href="/contato"
              className="px-4 py-3 rounded-lg text-sm bg-gray-200 border border-gray-400 text-black hover:bg-gray-300 transition"
            >
              Contato
            </a>
          </div>
        </div>

        {/* Message */}
        <div className="mt-6 max-w-md">
          <h2 className="text-2xl md:text-3xl font-semibold mb-2">
            Essa página que você está procurando não existe
          </h2>
          <p>
            Pode ser que o link esteja incorreto, a página foi removida ou ainda não foi criada.
          </p>
        </div>
      </div>
    </main>
  );
}
