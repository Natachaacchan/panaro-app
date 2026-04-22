import { motion, AnimatePresence } from "motion/react";
import { X, Clock, Zap, Target, Calendar, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";

interface TimeBlock {
  timeBlock: string;
  taskTitle: string;
  reason: string;
  focusLevel: "high" | "medium" | "low";
}

interface OrganizeDayModalProps {
  isOpen: boolean;
  onClose: () => void;
  organization: TimeBlock[];
  totalHours: number;
  overloadLevel: "low" | "medium" | "high";
  suggestion: string;
}

export function OrganizeDayModal({ isOpen, onClose, organization, totalHours, overloadLevel, suggestion }: OrganizeDayModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setIsAnalyzing(true);
      const timer = setTimeout(() => setIsAnalyzing(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  const overloadColors = {
    low: { bg: "bg-green-100", text: "text-green-700", border: "border-green-300" },
    medium: { bg: "bg-yellow-100", text: "text-yellow-700", border: "border-yellow-300" },
    high: { bg: "bg-red-100", text: "text-red-700", border: "border-red-300" },
  };

  const focusColors = {
    high: { bg: "bg-emerald-50", border: "border-emerald-300", dot: "bg-emerald-500" },
    medium: { bg: "bg-blue-50", border: "border-blue-300", dot: "bg-blue-500" },
    low: { bg: "bg-slate-50", border: "border-slate-300", dot: "bg-slate-400" },
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-50"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
          >
            <div className="bg-[#1a1625]/95 backdrop-blur-2xl border border-purple-500/30 rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gradient-to-r from-purple-500 to-pink-500 px-8 py-6 text-white relative overflow-hidden">
                {/* Glow effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 blur-xl opacity-50" />
                
                <div className="relative flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-3 bg-white/20 backdrop-blur-sm rounded-xl border border-white/30">
                      <Zap className="w-6 h-6" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Organização Inteligente do Dia</h2>
                      <p className="text-purple-100 text-sm">IA analisou suas tarefas e otimizou sua agenda</p>
                    </div>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.1, rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={onClose}
                    className="p-2 hover:bg-white/20 rounded-xl transition-colors"
                  >
                    <X className="w-6 h-6" />
                  </motion.button>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 overflow-y-auto max-h-[calc(90vh-180px)]">
                {isAnalyzing ? (
                  <div className="flex flex-col items-center justify-center py-12">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      className="w-16 h-16 border-4 border-violet-200 border-t-violet-600 rounded-full mb-4"
                    />
                    <p className="text-lg text-slate-600 mb-2">Analisando padrões...</p>
                    <p className="text-sm text-slate-500">Otimizando sua produtividade</p>
                  </div>
                ) : (
                  <>
                    {/* Resumo */}
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      <div className="bg-gradient-to-br from-violet-50 to-purple-50 rounded-2xl p-4 border border-violet-200">
                        <Clock className="w-5 h-5 text-violet-600 mb-2" />
                        <p className="text-2xl font-bold text-slate-800">{totalHours}h</p>
                        <p className="text-xs text-slate-600">Carga total</p>
                      </div>
                      <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-4 border border-blue-200">
                        <Target className="w-5 h-5 text-blue-600 mb-2" />
                        <p className="text-2xl font-bold text-slate-800">{organization.length}</p>
                        <p className="text-xs text-slate-600">Tarefas</p>
                      </div>
                      <div className={`rounded-2xl p-4 border ${overloadColors[overloadLevel].bg} ${overloadColors[overloadLevel].border}`}>
                        <AlertCircle className={`w-5 h-5 mb-2 ${overloadColors[overloadLevel].text}`} />
                        <p className={`text-2xl font-bold ${overloadColors[overloadLevel].text}`}>
                          {overloadLevel === "low" ? "Leve" : overloadLevel === "medium" ? "Médio" : "Alto"}
                        </p>
                        <p className="text-xs text-slate-600">Nível de carga</p>
                      </div>
                    </div>

                    {/* Sugestão da IA */}
                    <div className="bg-gradient-to-r from-violet-50 to-purple-50 border border-violet-200 rounded-2xl p-5 mb-6">
                      <div className="flex items-start gap-3">
                        <div className="p-2 bg-violet-100 rounded-lg">
                          <Zap className="w-5 h-5 text-violet-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-slate-800 mb-1">Sugestão Estratégica</h3>
                          <p className="text-sm text-slate-600 leading-relaxed">{suggestion}</p>
                        </div>
                      </div>
                    </div>

                    {/* Timeline */}
                    <div>
                      <h3 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
                        <Calendar className="w-5 h-5 text-violet-600" />
                        Linha do Tempo Otimizada
                      </h3>
                      <div className="space-y-3">
                        {organization.map((block, index) => (
                          <motion.div
                            key={index}
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: index * 0.1 }}
                            className={`relative pl-6 pb-4 ${index < organization.length - 1 ? 'border-l-2 border-slate-200' : ''}`}
                          >
                            <div className={`absolute left-0 top-2 -translate-x-1/2 w-4 h-4 rounded-full ${focusColors[block.focusLevel].dot} border-4 border-white shadow-lg`} />
                            
                            <div className={`p-4 rounded-xl border-2 ${focusColors[block.focusLevel].bg} ${focusColors[block.focusLevel].border}`}>
                              <div className="flex items-start justify-between mb-2">
                                <div>
                                  <p className="text-sm font-bold text-violet-600">{block.timeBlock}</p>
                                  <h4 className="font-semibold text-slate-800">{block.taskTitle}</h4>
                                </div>
                                <span className={`text-xs px-2 py-1 rounded-full ${
                                  block.focusLevel === "high" ? "bg-emerald-100 text-emerald-700" :
                                  block.focusLevel === "medium" ? "bg-blue-100 text-blue-700" :
                                  "bg-slate-100 text-slate-700"
                                }`}>
                                  Foco {block.focusLevel === "high" ? "Alto" : block.focusLevel === "medium" ? "Médio" : "Baixo"}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{block.reason}</p>
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* Footer */}
              {!isAnalyzing && (
                <div className="border-t border-slate-200 px-8 py-4 bg-slate-50 flex gap-3">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={onClose}
                    className="flex-1 px-6 py-3 bg-white border-2 border-slate-200 rounded-xl font-medium text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    Fechar
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-6 py-3 bg-gradient-to-r from-violet-500 to-purple-600 text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-shadow"
                  >
                    Aplicar Organização
                  </motion.button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}