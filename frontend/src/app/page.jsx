'use client';

import { useState, useEffect, useRef } from 'react';
import * as THREE from 'three';
import GLOBE from 'vanta/dist/vanta.globe.min';
import axios from 'axios';

// Credenciais de teste disponíveis no banco:
// alice@teste.com / password (Administrador)
// bruno@teste.com / password (Técnico)
// carla@teste.com / password (Técnico)
// daniela@teste.com / password (Usuário)
// eduardo@teste.com / password (Usuário)

export default function LoginPage() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [isLoading, setIsLoading] = useState(false); // Estado para controlar o loading
  const [error, setError] = useState(''); // Estado para mensagens de erro
  const [emailError, setEmailError] = useState(''); // Erro específico do email
  const [senhaError, setSenhaError] = useState(''); // Erro específico da senha

  useEffect(() => {
    if (!vantaEffect.current) {
      vantaEffect.current = GLOBE({
        el: vantaRef.current,
        mouseControls: true,
        touchControls: false,
        gyroControls: false,
        minHeight: 200.0,
        minWidth: 200.0,
        scale: 1.0,
        scaleMobile: 1.0,
        THREE: THREE,
        color: 0xf50000,
        backgroundColor: 0x000000,
      });
    }
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  const validateForm = () => {
    setEmailError('');
    setSenhaError('');
    setError('');
    
    let isValid = true;
    
    if (!email.trim()) {
      setEmailError('Email é obrigatório');
      isValid = false;
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Email inválido');
      isValid = false;
    }
    
    if (!senha.trim()) {
      setSenhaError('Senha é obrigatória');
      isValid = false;
    }
    
    return isValid;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    setIsLoading(true);
    setError('');
    
    try {
      const { data } = await axios.post(
        'http://localhost:8080/auth/login',
        { email: email.trim(), senha },
        { withCredentials: true }
      );

      if (!data.user) {
        setError('Erro: usuário não retornado do backend');
        return;
      }

      const funcao = data.user.funcao;

      if (funcao === 'administrador') {
        window.location.href = '/admin';
      } else if (funcao === 'tecnico') {
        window.location.href = '/tecnicos';
      } else if (funcao === 'usuario') {
        window.location.href = '/home';
      }
    } catch (error) {
      console.error('Erro no login:', error.response?.data || error.message);
      
      if (error.response?.status === 404) {
        setError('Usuário não encontrado');
      } else if (error.response?.status === 401) {
        setError('Senha incorreta');
      } else if (error.response?.status === 500) {
        setError('Erro interno do servidor');
      } else if (error.code === 'ERR_NETWORK') {
        setError('Erro de conexão. Verifique se o servidor está rodando.');
      } else {
        setError('Erro ao fazer login. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  // Se estiver carregando, exibe a animação de loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#000000] flex items-center justify-center">
        <div className="flex flex-row gap-2">
          <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce"></div>
          <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.3s]"></div>
          <div className="w-4 h-4 rounded-full bg-[#E31B23] animate-bounce [animation-delay:-0.5s]"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Vanta.js Background */}
      <div ref={vantaRef} className="absolute inset-0 w-full h-full" style={{ zIndex: 0 }} />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Unified Login Container with Blur Background */}
          <div className="bg-white/15 backdrop-blur-md rounded-2xl p-12 border border-white/25 shadow-2xl">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              {/* Welcome Section */}
              <div className="text-white space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h1
                    className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom, #FF0000, #3c3c3c)',
                    }}
                  >
                    Bem-vindo
                  </h1>
                  <p className="text-lg text-gray-300">
                    Use o seu email institucional para fazer login
                  </p>
                </div>

                <div className="space-y-4 text-sm text-gray-400">
                  <p>• Acesso seguro com credenciais institucionais</p>
                  <p>• Mantenha seus dados sempre protegidos</p>
                  <p>• Suporte 24/7 disponível</p>
                </div>
              </div>

              {/* Login Form Section */}
              <div className="w-full">
                <div className="text-center mb-8">
                  <h2 className="text-2xl font-bold text-white mb-2">Login</h2>
                  <p className="text-gray-300 text-sm">Entre com suas credenciais</p>
                </div>

                <div className="space-y-6">
                  {/* Email Field */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-white border-l-4 pl-3"
                      style={{
                        borderImage: 'linear-gradient(to bottom, #FF0000, #3c3c3c) 1',
                      }}
                    >
                      Email Institucional
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        setEmailError('');
                        setError('');
                      }}
                      onKeyPress={handleKeyPress}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 ${
                        emailError ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="seu.email@instituicao.com"
                      disabled={isLoading}
                    />
                    {emailError && (
                      <p className="text-red-400 text-sm mt-1">{emailError}</p>
                    )}
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-white border-l-4 pl-3"
                      style={{
                        borderImage: 'linear-gradient(to bottom, #FF0000, #3c3c3c) 1',
                      }}
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => {
                        setSenha(e.target.value);
                        setSenhaError('');
                        setError('');
                      }}
                      onKeyPress={handleKeyPress}
                      className={`w-full px-4 py-3 bg-white/10 border rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300 ${
                        senhaError ? 'border-red-400' : 'border-white/20'
                      }`}
                      placeholder="••••••••"
                      disabled={isLoading}
                    />
                    {senhaError && (
                      <p className="text-red-400 text-sm mt-1">{senhaError}</p>
                    )}
                  </div>

                  {/* Error Message */}
                  {error && (
                    <div className="bg-red-500/20 border border-red-400/50 rounded-lg p-3">
                      <p className="text-red-400 text-sm text-center">{error}</p>
                    </div>
                  )}

                  {/* Login Button */}
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    style={{
                      background: 'linear-gradient(to bottom, #FF0000, #3c3c3c)',
                    }}
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                        <span>Entrando...</span>
                      </div>
                    ) : (
                      'Entrar'
                    )}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}