import { motion } from "motion/react";
import { Brain, TrendingUp, AlertTriangle, Lightbulb, ArrowRight } from "lucide-react";

interface AIInsightCardProps {
  type: "productivity" | "pattern" | "warning" | "suggestion";
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
  impact: "high" | "medium" | "low";
  onAction?: () => void;
}

const iconMap = {
  productivity: TrendingUp,
  pattern: Brain,
  warning: AlertTriangle,
  suggestion: Lightbulb,
};

const colorMap = {
  productivity: {
    bg: "from-emerald-500/10 to-green-500/10",
    border: "border-emerald-500/30",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/20",
  },
  pattern: {
    bg: "from-blue-500/10 to-cyan-500/10",
    border: "border-blue-500/30",
    icon: "text-blue-400",
    iconBg: "bg-blue-500/20",
  },
  warning: {
    bg: "from-orange-500/10 to-red-500/10",
    border: "border-orange-500/30",
    icon: "text-orange-400",
    iconBg: "bg-orange-500/20",
  },
  suggestion: {
    bg: "from-violet-500/10 to-purple-500/10",
    border: "border-violet-500/30",
    icon: "text-violet-400",
    iconBg: "bg-violet-500/20",
  },
};

export function AIInsightCard({ type, title, message, action, actionLabel, impact, onAction }: AIInsightCardProps) {
  const Icon = iconMap[type];
  const colors = colorMap[type];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className={`relative p-5 rounded-2xl bg-gradient-to-br ${colors.bg} backdrop-blur-xl border ${colors.border} shadow-xl hover:shadow-2xl transition-all overflow-hidden`}
    >
      {/* Background pattern */}
      <div className="absolute top-0 right-0 opacity-5">
        <Icon className="w-32 h-32" />
      </div>

      <div className="relative flex gap-4">
        <div className={`flex-shrink-0 w-12 h-12 rounded-xl ${colors.iconBg} border ${colors.border} flex items-center justify-center backdrop-blur-sm`}>
          <Icon className={`w-6 h-6 ${colors.icon}`} />
        </div>

        <div className="flex-1">
          <div className="flex items-start justify-between mb-2">
            <h3 className="font-bold text-white">{title}</h3>
            <span className={`text-xs px-2 py-1 rounded-full ${
              impact === "high" ? "bg-red-500/20 border border-red-500/30 text-red-400" :
              impact === "medium" ? "bg-yellow-500/20 border border-yellow-500/30 text-yellow-400" :
              "bg-slate-500/20 border border-slate-500/30 text-slate-400"
            }`}>
              {impact === "high" ? "Alto impacto" : impact === "medium" ? "Médio impacto" : "Baixo impacto"}
            </span>
          </div>

          <p className="text-sm text-slate-300 leading-relaxed mb-3">
            {message}
          </p>

          {action && actionLabel && (
            <motion.button
              whileHover={{ x: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={onAction}
              className={`inline-flex items-center gap-2 text-sm font-medium ${colors.icon} hover:underline`}
            >
              {actionLabel}
              <ArrowRight className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>
    </motion.div>
  );
}