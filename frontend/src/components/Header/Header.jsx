"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const userData = localStorage.getItem("usuario");
    if (userData) {
      const user = JSON.parse(userData);
      setUserName(user.nome);
    }

    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("usuario");
    window.location.href = "/";
  };

  return (
    <header className="bg-white text-[#004aad] w-full border-b shadow-sm z-40 relative">
      <div className="max-w-screen-xl mx-auto flex items-center justify-between px-4 h-16 lg:h-20">
        {/* Botão Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="lg:hidden flex flex-col items-center justify-center p-2 rounded-md hover:bg-[#004aad]/10 transition-colors"
          aria-label="Abrir menu"
        >
          <span className="w-6 h-0.5 bg-[#004aad] rounded-full" />
          <span className="w-6 h-0.5 bg-[#004aad] rounded-full mt-1.5" />
          <span className="w-6 h-0.5 bg-[#004aad] rounded-full mt-1.5" />
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center h-full mx-auto lg:mx-0">
          <img
            src="/logo-manutencao-escolar.png"
            alt="Logo Sistema de Manutenção"
            className="h-10 lg:h-12 w-auto object-contain"
          />
        </Link>

        {/* Menu Desktop */}
        <div className="hidden lg:flex items-center justify-center flex-1">
          <nav>
            <ul className="flex gap-6 text-base font-medium items-center">
              {[
                ["Início", "/"],
                ["Meus Chamados", "/meus-chamados"],
                ["Relatórios", "/relatorios"],
              
              ].map(([label, href]) => (
                <li key={label}>
                  <Link
                    href={href}
                    className="relative group block px-2 py-2 text-[#004aad] hover:text-[#003a8c] transition-colors"
                  >
                    {label}
                    <span className="absolute left-1/2 -bottom-1 w-0 h-[2px] bg-[#004aad] transition-all duration-300 group-hover:w-full group-hover:left-0" />
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Área do usuário */}
        <div className="flex items-center gap-4">
          {userName && (
            <>
              {/* Versão Desktop */}
              <div className="hidden lg:block relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 text-[#004aad] font-medium hover:text-[#003a8c] transition-colors"
                >
                  <span>Olá, {userName}</span>
                  <svg
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isDropdownOpen ? "rotate-180" : ""
                    }`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                </button>

                {isDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50 border border-gray-200">
                    <Link
                      href="/perfil"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#004aad]/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Meu Perfil
                    </Link>
                    <Link
                      href="/configuracoes"
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-[#004aad]/10 transition-colors"
                      onClick={() => setIsDropdownOpen(false)}
                    >
                      Configurações
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-[#004aad]/10 transition-colors"
                    >
                      Sair
                    </button>
                  </div>
                )}
              </div>

              {/* Versão Mobile - Ícone de perfil */}
              <Link
                href="/perfil"
                className="lg:hidden flex items-center justify-center p-2 rounded-full hover:bg-[#004aad]/10"
                aria-label="Meu perfil"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-[#004aad]"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                  />
                </svg>
              </Link>
            </>
          )}
          
          {/* Botão "Novo Chamado" visível apenas em telas grandes */}
          <Link
            href="/novo-chamado"
            className="hidden lg:block px-4 py-3 bg-[#004aad] text-white rounded-4xl hover:bg-[#003a8c] transition duration-300 shadow-sm hover:shadow-md whitespace-nowrap"
          >
            Novo Chamado
          </Link>
        </div>
      </div>

      {/* Menu Mobile Expandido */}
      <nav
        className={`lg:hidden transition-all duration-500 overflow-hidden bg-white border-t border-gray-200 ${
          isOpen ? "max-h-screen py-4" : "max-h-0 py-0"
        }`}
      >
        <ul className="flex flex-col gap-4 text-base font-medium px-5">
          {[
            ["Início", "/"],
            ["Meus Chamados", "/meus-chamados"],
            ["Relatórios", "/relatorios"],
            ["Meu Perfil", "/perfil"],
            ["Configurações", "/configuracoes"],
          ].map(([label, href]) => (
            <li key={label}>
              <Link
                href={href}
                className="block py-3 px-2 text-[#004aad] hover:text-[#003a8c] transition-colors border-b border-gray-100"
                onClick={() => setIsOpen(false)}
              >
                {label}
              </Link>
            </li>
          ))}
          {userName && (
            <li>
              <button
                onClick={() => {
                  handleLogout();
                  setIsOpen(false);
                }}
                className="w-full text-left py-3 px-2 text-[#004aad] hover:text-[#003a8c] transition-colors border-b border-gray-100"
              >
                Sair
              </button>
            </li>
          )}
        </ul>
      </nav>
    </header>
  );
}