"use client"
import { useState } from 'react';
import React, { useEffect, useRef } from "react";
import * as THREE from "three";
import GLOBE from "vanta/dist/vanta.globe.min";
import axios from 'axios';

export default function LoginPage() {
  const vantaRef = useRef(null);
  const vantaEffect = useRef(null);

  // estados para armazenar email e senha
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

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
        backgroundColor: 0x000000
      });
    }
    return () => {
      if (vantaEffect.current) vantaEffect.current.destroy();
    };
  }, []);

  const handleLogin = async () => {
    try {
      const { data } = await axios.post('http://localhost:8080/auth/login',
        { email, senha },
        { withCredentials: true }
      );
  
      if (!data.user) {
        alert("Erro: usuário não retornado do backend");
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
      console.error("Erro no login:", error.response?.data || error.message);
      alert("Email ou senha inválidos");
    }
  };
  

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Vanta.js Background */}
      <div
        ref={vantaRef}
        className="absolute inset-0 w-full h-full"
        style={{ zIndex: 0 }}
      />

      {/* Main Content */}
      <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-4xl">
          {/* Unified Login Container with Blur Background */}
          <div
            className="bg-white/15 backdrop-blur-md rounded-2xl p-12 border border-white/25 shadow-2xl"
          >
            <div className="grid lg:grid-cols-2 gap-12 items-center">

              {/* Welcome Section */}
              <div className="text-white space-y-8 text-center lg:text-left">
                <div className="space-y-4">
                  <h1 className="text-4xl lg:text-5xl font-bold text-transparent bg-clip-text"
                    style={{
                      backgroundImage: 'linear-gradient(to bottom, #FF0000, #3c3c3c)'
                    }}>
                    Bem-vindo
                  </h1>
                  <p className="text-lg text-gray-300">
                    Use o seu email institucional para fazer login
                  </p>
                </div>

                <div className="space-y-4 text-sm text-gray-400">
                  <p>
                    • Acesso seguro com credenciais institucionais
                  </p>
                  <p>
                    • Mantenha seus dados sempre protegidos
                  </p>
                  <p>
                    • Suporte 24/7 disponível
                  </p>
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
                        borderImage: 'linear-gradient(to bottom, #FF0000, #3c3c3c) 1'
                      }}
                    >
                      Email Institucional
                    </label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300"
                      placeholder="seu.email@instituicao.com"
                    />
                  </div>

                  {/* Password Field */}
                  <div className="space-y-2">
                    <label
                      className="block text-sm font-medium text-white border-l-4 pl-3"
                      style={{
                        borderImage: 'linear-gradient(to bottom, #FF0000, #3c3c3c) 1'
                      }}
                    >
                      Senha
                    </label>
                    <input
                      type="password"
                      value={senha}
                      onChange={(e) => setSenha(e.target.value)}
                      className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:border-transparent transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>

                  {/* Login Button */}
                  <button
                    onClick={handleLogin}
                    className="w-full py-3 px-4 text-white font-semibold rounded-lg transition-all duration-300 transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-red-500/50 focus:ring-offset-2 focus:ring-offset-transparent shadow-lg"
                    style={{
                      background: 'linear-gradient(to bottom, #FF0000, #3c3c3c)',
                    }}
                  >
                    Entrar
                  </button>

                  {/* Forgot Password */}
                  <div className="text-center">
                    <button
                      type="button"
                      className="text-sm text-gray-300 hover:text-white transition-colors duration-300 underline"
                    >
                      Esqueceu sua senha?
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};