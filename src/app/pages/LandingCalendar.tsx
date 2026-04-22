import { motion, useMotionValue, useTransform } from "motion/react";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router";
import { ArrowRight, Sparkles } from "lucide-react";

// Estrelas animadas do fundo
const Starfield = () => {
  const stars = Array.from({ length: 200 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2 + 0.5,
    delay: Math.random() * 3,
    duration: Math.random() * 3 + 2,
  }));

  return (
    <div className="absolute inset-0 overflow-hidden">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-white"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

// Logo esfera roxa brilhante
const PanoraLogo = () => {
  return (
    <motion.div
      initial={{ scale: 0, rotate: -180 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ duration: 1.5, type: "spring" }}
      className="relative w-48 h-48 mx-auto mb-8"
    >
      {/* Glow externo */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute inset-0 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full blur-3xl"
      />
      
      {/* Esfera principal */}
      <motion.div
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "linear",
        }}
        className="relative w-full h-full"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-purple-400 via-purple-500 to-pink-500 rounded-full shadow-2xl shadow-purple-500/50" />
        
        {/* Brilho interno */}
        <div className="absolute inset-8 bg-purple-900/40 backdrop-blur-sm rounded-full border border-white/30" />
        
        {/* Reflexo */}
        <div className="absolute top-8 left-8 w-16 h-16 bg-white/40 rounded-full blur-xl" />
      </motion.div>

      {/* Partículas orbitando */}
      {[...Array(3)].map((_, i) => (
        <motion.div
          key={i}
          animate={{
            rotate: 360,
          }}
          transition={{
            duration: 8 - i * 2,
            repeat: Infinity,
            ease: "linear",
          }}
          className="absolute inset-0"
        >
          <div
            className="absolute w-3 h-3 bg-white rounded-full shadow-lg"
            style={{
              top: `${50 + 40 * Math.sin((i * 120 * Math.PI) / 180)}%`,
              left: `${50 + 40 * Math.cos((i * 120 * Math.PI) / 180)}%`,
            }}
          />
        </motion.div>
      ))}
    </motion.div>
  );
};

export function LandingCalendar() {
  const navigate = useNavigate();

  const handleEnter = () => {
    navigate("/dashboard");
  };

  return (
    <div className="relative w-full h-screen overflow-hidden bg-[#0f0b1a]">
      {/* Starfield Background */}
      <Starfield />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
      <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-pink-600/20 rounded-full blur-[120px]" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-purple-500/10 rounded-full blur-[200px]" />

      {/* Linha do horizonte cósmico */}
      <div className="absolute top-1/2 left-0 right-0 h-px bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
      
      {/* Horizonte brilhante */}
      <motion.div
        animate={{
          opacity: [0.3, 0.6, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-1 bg-gradient-to-r from-transparent via-purple-500 to-transparent blur-sm"
      />

      {/* Conteúdo Principal */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full px-8">
        {/* Logo */}
        <PanoraLogo />

        {/* Título */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="text-center mb-12"
        >
          <h1 className="text-7xl font-bold text-white mb-4">
            Panora
          </h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="text-2xl text-purple-200/80"
          >
            Visão total da sua rotina.
          </motion.p>
        </motion.div>

        {/* Cards de Features */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl"
        >
          {[
            { icon: "🧠", title: "IA Inteligente", desc: "Análise preditiva de produtividade" },
            { icon: "⚡", title: "Organização Auto", desc: "Planeje seu dia automaticamente" },
            { icon: "📊", title: "Insights Reais", desc: "Dados que realmente importam" },
          ].map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.2 + index * 0.2 }}
              whileHover={{ scale: 1.05, y: -5 }}
              className="bg-[#1a1625]/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 text-center"
            >
              <div className="text-4xl mb-3">{feature.icon}</div>
              <h3 className="text-white font-bold mb-2">{feature.title}</h3>
              <p className="text-purple-200/70 text-sm">{feature.desc}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Botão de Entrada */}
        <motion.button
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.8 }}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleEnter}
          className="relative group"
        >
          {/* Glow do botão */}
          <motion.div
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.5, 0.8, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
            className="absolute inset-0 bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl blur-2xl"
          />
          
          {/* Botão */}
          <div className="relative px-12 py-5 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-2xl font-bold text-xl shadow-2xl flex items-center gap-3">
            <Sparkles className="w-6 h-6" />
            Entrar no Panora
            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
          </div>
        </motion.button>

        {/* Tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          className="mt-8 text-purple-300/60 text-sm"
        >
          Sistema de organização com inteligência adaptativa
        </motion.p>
      </div>

      {/* Partículas flutuantes */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-purple-400/30 rounded-full"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
          }}
          animate={{
            y: [-20, -40, -20],
            opacity: [0.3, 0.8, 0.3],
          }}
          transition={{
            duration: 3 + Math.random() * 2,
            repeat: Infinity,
            delay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}
