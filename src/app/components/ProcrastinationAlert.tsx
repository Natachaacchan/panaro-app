import { motion } from "motion/react";
import { AlertTriangle, TrendingDown, X } from "lucide-react";

interface ProcrastinationAlertProps {
  taskTitle: string;
  daysPostponed: number;
  suggestion: string;
  actions: Array<{ type: string; label: string }>;
  onAction: (type: string) => void;
  onDismiss: () => void;
}

export function ProcrastinationAlert({ 
  taskTitle, 
  daysPostponed, 
  suggestion, 
  actions, 
  onAction,
  onDismiss 
}: ProcrastinationAlertProps) {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      className="relative bg-gradient-to-r from-orange-500/10 to-red-500/10 backdrop-blur-xl border-2 border-orange-500/30 rounded-2xl p-5 shadow-2xl overflow-hidden"
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 opacity-5">
        <TrendingDown className="w-32 h-32" />
      </div>

      {/* Close button */}
      <motion.button
        whileHover={{ scale: 1.1, rotate: 90 }}
        whileTap={{ scale: 0.9 }}
        onClick={onDismiss}
        className="absolute top-3 right-3 p-1 hover:bg-orange-500/20 rounded-lg transition-colors"
      >
        <X className="w-4 h-4 text-orange-400" />
      </motion.button>

      <div className="relative flex gap-4">
        <div className="flex-shrink-0 w-12 h-12 rounded-xl bg-orange-500/20 border border-orange-500/30 flex items-center justify-center backdrop-blur-sm">
          <AlertTriangle className="w-6 h-6 text-orange-400" />
        </div>

        <div className="flex-1">
          <div className="mb-2">
            <span className="inline-block px-3 py-1 bg-orange-500/20 border border-orange-500/30 text-orange-400 rounded-full text-xs font-bold mb-2">
              Padrão de Procrastinação Detectado
            </span>
            <h3 className="font-bold text-white mb-1">{taskTitle}</h3>
            <p className="text-sm text-orange-400">
              Adiada há <span className="font-bold">{daysPostponed}</span> {daysPostponed === 1 ? 'dia' : 'dias'}
            </p>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-4 bg-white/5 backdrop-blur-sm p-3 rounded-xl border border-white/10">
            {suggestion}
          </p>

          <div className="flex flex-wrap gap-2">
            {actions.map((action) => (
              <motion.button
                key={action.type}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => onAction(action.type)}
                className="px-4 py-2 bg-white/5 backdrop-blur-sm border border-orange-500/30 rounded-xl text-sm font-medium text-slate-200 hover:bg-orange-500/20 hover:border-orange-500/50 transition-colors"
              >
                {action.label}
              </motion.button>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  );
}