export default function Footer() {
  return (
    // component footer
    <footer className="w-full bg-slate-100 text-slate-600 border-t">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 text-center sm:text-left">
          
          {/* Logo da Empresa */}
          <div className="flex flex-col items-center sm:items-start gap-4">
            <img
              src="/logo.svg"
              alt="LogoSenaiZelos"
              className="h-25 w-auto object-contain"
            />
            <p className="text-sm max-w-xs">Aqui para ajudar com seus problemas.</p>
          </div>

          {/* Navegação */}
          <div>
            <h4 className="text-slate-700 font-semibold mb-4">Links rápidos</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="/home" className="hover:text-[#004aad]">Home</a></li>
              <li><a href="/agenda" className="hover:text-[#004aad]">Agenda</a></li>
              <li><a href="/sobrenos" className="hover:text-[#004aad]">Sobre nós</a></li>
              <li><a href="/sobrenos#faq" className="hover:text-[#004aad]">FAQ</a></li>
            </ul>
          </div>

          {/* Contato */}
          <div>
            <h4 className="text-slate-700 font-semibold mb-4">Entre em contato</h4>
            <ul className="space-y-2 text-sm">
              <li><strong>Email:</strong>  senaizelos@gmail.com</li>
              <li><strong>Suporte:</strong> senaizelossuporte@gmail.com</li>
              <li><strong>Telefone:</strong> (11) 99999-9999</li>
            </ul>
          </div>

          {/* Redes sociais */}
          <div>
            <h4 className="text-slate-700 font-semibold mb-4">Siga-nos nas redes</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="https://www.instagram.com/" className="hover:text-[#004aad]">Instagram</a></li>
              <li><a href="https://br.linkedin.com/" className="hover:text-[#004aad]">LinkedIn</a></li>
              <li><a href="https://www.facebook.com/" className="hover:text-[#004aad]">Facebook</a></li>
            </ul>
          </div>
        </div>

        {/* Copyright */}
        <div className="mt-12 border-t pt-6 text-center text-xs text-slate-400">
          ©SENAIZELOS. Todos os direitos reservados.
        </div>
      </div>
    </footer>
  );
}
