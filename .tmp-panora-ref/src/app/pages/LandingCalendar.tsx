import { motion } from "motion/react";
import { useNavigate } from "react-router";
import { ArrowRight, Brain, Zap, BarChart3, Calendar, CheckCircle2, Sparkles } from "lucide-react";

export function LandingCalendar() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <Brain className="w-8 h-8" />,
      title: "IA Contextual",
      description: "Sistema inteligente que aprende seus padrões de trabalho e sugere otimizações personalizadas.",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "Organização Automática",
      description: "Algoritmos de produtividade que organizam automaticamente seu dia com base em prioridades.",
    },
    {
      icon: <BarChart3 className="w-8 h-8" />,
      title: "Insights Inteligentes",
      description: "Análise profunda de padrões de procrastinação e sugestões práticas para melhorar.",
    },
    {
      icon: <Calendar className="w-8 h-8" />,
      title: "Múltiplas Visualizações",
      description: "Kanban, Lista, Calendário e muito mais. Veja suas tarefas da forma que preferir.",
    },
  ];

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a0a0f]">
      {/* Background Effects */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle gradient */}
        <div className="absolute top-0 right-1/3 w-[800px] h-[800px] bg-purple-500/5 rounded-full blur-[150px]" />
        <div className="absolute bottom-0 left-1/3 w-[600px] h-[600px] bg-pink-500/5 rounded-full blur-[120px]" />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20 pt-20"
        >
          {/* Logo Badge */}
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 mb-6 bg-purple-500/10 border border-purple-500/20 rounded-full"
          >
            <Sparkles className="w-3.5 h-3.5 text-purple-400" />
            <span className="text-xs font-medium text-purple-300">Powered by AI</span>
          </motion.div>

          {/* Main Heading */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mb-5"
          >
            <span className="block text-5xl md:text-6xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent mb-3">
              Panora
            </span>
            <span className="block text-2xl md:text-3xl text-gray-300 font-medium">
              Gerenciamento Inteligente de Rotina
            </span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-base md:text-lg text-gray-400 max-w-2xl mx-auto mb-8"
          >
            Combine o melhor do Notion e ClickUp com inteligência artificial contextual.
            Organize tarefas, projetos e estudos de forma intuitiva e eficiente.
          </motion.p>

          {/* CTA Button */}
          <motion.button
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 px-7 py-3.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors"
          >
            Começar Agora
            <ArrowRight className="w-4 h-4" />
          </motion.button>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-16"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + index * 0.05 }}
              className="p-6 bg-[#1a1a24]/30 backdrop-blur-sm border border-white/5 rounded-xl hover:border-white/10 transition-colors"
            >
              {/* Icon */}
              <div className="inline-flex items-center justify-center w-12 h-12 mb-4 bg-purple-500/10 rounded-lg text-purple-400">
                {feature.icon}
              </div>

              {/* Content */}
              <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Additional Features List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="max-w-3xl mx-auto"
        >
          <h2 className="text-2xl md:text-3xl font-semibold text-white text-center mb-8">
            Tudo que você precisa em um só lugar
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {[
              "Detecção de procrastinação com IA",
              "Editor visual de fluxogramas",
              "Dashboard com métricas em tempo real",
              "Sistema de tags e categorias",
              "Interface moderna e intuitiva",
              "Sincronização automática",
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1 + index * 0.05 }}
                className="flex items-center gap-2.5 text-gray-300"
              >
                <CheckCircle2 className="w-4 h-4 text-purple-400 flex-shrink-0" />
                <span className="text-sm">{item}</span>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.3 }}
          className="text-center mt-16 pt-8 border-t border-white/5"
        >
          <p className="text-gray-500 text-sm">
            © 2026 Panora. Sistema de organização com inteligência adaptativa.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
