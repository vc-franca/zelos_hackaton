
'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import { Menu, X } from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();
  const [showNavbar, setShowNavbar] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const navRef = useRef(null);

  // Medir altura da navbar e aplicar padding-top no body
  useEffect(() => {
    const updateNavHeight = () => {
      if (navRef.current) {
        const height = navRef.current.offsetHeight;
        document.body.style.paddingTop = `${height}px`;
      }
    };

    updateNavHeight();
    window.addEventListener('resize', updateNavHeight);

    return () => {
      window.removeEventListener('resize', updateNavHeight);
      document.body.style.paddingTop = '';
    };
  }, []);

  // Esconder/mostrar a navbar com base no scroll
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY && currentScrollY > 50) {
        setShowNavbar(false);
      } else {
        setShowNavbar(true);
      }
      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [lastScrollY]);

  // Fechar menu ao clicar fora
  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        isOpen &&
        !event.target.closest('.menu-panel') &&
        !event.target.closest('.menu-toggle')
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, [isOpen]);

  // Navegar com fechamento de menu
  const handleNavigation = (path) => {
    setIsOpen(false);
    router.push(path);
  };

  // Função de logout
  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8080/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setIsOpen(false); // Fechar o menu
      router.push('/');
    } catch (err) {
      console.error('Erro ao fazer logout:', err);
      alert('Erro ao fazer logout. Tente novamente.');
    }
  };

  return (
    <>
      <nav
        ref={navRef}
        className={`fixed top-0 left-0 right-0 z-50 bg-white shadow-md transition-transform duration-200 ${
          showNavbar ? 'translate-y-0' : '-translate-y-full'
        }`}
      >
        <div className="flex items-center justify-between px-4 py-3 relative">
          {/* Botão hambúrguer à esquerda */}
          <button
            className="menu-toggle flex flex-col justify-center text-black items-center w-8 h-8 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* Logo centralizado clicável */}
          <div
            className="absolute left-1/2 transform -translate-x-1/2 cursor-pointer flex items-center"
            onClick={() => router.push('/home')}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => {
              if (e.key === 'Enter') router.push('/');
            }}
          >
            <Image src="/logo.svg" alt="Logo" width={140} height={140} priority />
          </div>

          {/* Espaço vazio à direita para balancear */}
          <div className="w-8" />
        </div>
      </nav>

      {/* Fundo quando menu aberto */}
      <div className="relative z-40">
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsOpen(false)}
          />
        )}

        {/* Menu lateral esquerdo */}
        <div
          className={`fixed top-0 left-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out menu-panel z-50 ${
            isOpen ? 'translate-x-0' : '-translate-x-full'
          }`}
        >
          <div className="flex justify-end p-4">
            <button
              onClick={() => setIsOpen(false)}
              aria-label="Fechar menu"
              className="text-black hover:text-yellow-600 transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <ul className="px-6 py-4 space-y-4">
            <li
              className="text-lg text-black cursor-pointer hover:text-yellow-600 transition-colors"
              onClick={() => handleNavigation('/home')}
            >
              Início
            </li>
            <li
              className="text-lg text-black cursor-pointer hover:text-yellow-600 transition-colors"
              onClick={() => handleNavigation('/meus-chamados')}
            >
              Meus Chamados
            </li>
            <li
              className="text-lg text-black cursor-pointer hover:text-yellow-600 transition-colors"
              onClick={() => handleNavigation('/novo-chamado')}
            >
              Criar Chamado
            </li>
            <li
              className="text-lg text-black cursor-pointer hover:text-[#E31B23] transition-colors"
              onClick={handleLogout}
            >
              Sair
            </li>
          </ul>
        </div>
      </div>
    </>
  );
}
