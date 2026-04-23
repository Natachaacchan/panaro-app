import { motion } from "motion/react";
import { useState, useEffect } from "react";
import { 
  TrendingUp, 
  CheckCircle2, 
  Clock, 
  Target,
  Calendar,
  Zap,
  BarChart3,
  Activity,
  Brain,
  Sparkles,
  Plus
} from "lucide-react";
import { AIInsightCard } from "../components/AIInsightCard";
import { OrganizeDayModal } from "../components/OrganizeDayModal";
import { ProcrastinationAlert } from "../components/ProcrastinationAlert";
import { analyzeProductivity, organizeDayWithAI, detectProcrastination } from "../services/aiEngine";

const stats = [
  { 
    label: "Tarefas Concluídas", 
    value: "28", 
    change: "+18%", 
    icon: CheckCircle2,
    gradient: "from-emerald-500 to-teal-500"
  },
  { 
    label: "Em Progresso", 
    value: "9", 
    change: "+1", 
    icon: Clock,
    gradient: "from-blue-500 to-cyan-500"
  },
  { 
    label: "Projetos Ativos", 
    value: "7", 
    change: "+1", 
    icon: Target,
    gradient: "from-purple-500 to-pink-500"
  },
  { 
    label: "Produtividade", 
    value: "89%", 
    change: "+8%", 
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500"
  },
];

const mockTasks = [
  { 
    id: "1", 
    title: "Implementar autenticação", 
    status: "in-progress", 
    priority: "high", 
    dueDate: "2026-02-14",
    estimatedHours: 3,
    postponedCount: 0,
    completedAt: "2026-02-11T10:00:00"
  },
  { 
    id: "2", 
    title: "Estudar React avançado", 
    status: "todo", 
    priority: "medium", 
    dueDate: "2026-02-14",
    estimatedHours: 2,
    postponedCount: 4
  },
  { 
    id: "3", 
    title: "Reunião com equipe", 
    status: "todo", 
    priority: "high", 
    dueDate: "2026-02-14",
    estimatedHours: 1,
    postponedCount: 0
  },
  { 
    id: "4", 
    title: "Revisar documentação", 
    status: "done", 
    priority: "low", 
    dueDate: "2026-02-10",
    estimatedHours: 1,
    postponedCount: 0,
    completedAt: "2026-02-10T15:00:00"
  },
];

const recentTasks = [
  { id: 1, title: "Revisar apresentação do projeto", status: "done", priority: "high", dueDate: "Hoje" },
  { id: 2, title: "Estudar React avançado", status: "in-progress", priority: "medium", dueDate: "Amanhã" },
  { id: 3, title: "Reunião com equipe", status: "pending", priority: "high", dueDate: "Hoje" },
  { id: 4, title: "Atualizar documentação", status: "in-progress", priority: "low", dueDate: "Sex" },
];

const upcomingEvents = [
  { id: 1, title: "Stand-up diário", time: "09:00", type: "meeting" },
  { id: 2, title: "Deadline - Projeto Alpha", time: "18:00", type: "deadline" },
  { id: 3, title: "Sessão de estudo", time: "20:00", type: "study" },
];

export function Dashboard() {
  const [insights, setInsights] = useState<any[]>([]);
  const [procrastinationAlerts, setProcrastinationAlerts] = useState<any[]>([]);
  const [showOrganizeModal, setShowOrganizeModal] = useState(false);
  const [dayOrganization, setDayOrganization] = useState<any>(null);

  useEffect(() => {
    const aiInsights = analyzeProductivity(mockTasks);
    setInsights(aiInsights);

    const alerts = detectProcrastination(mockTasks);
    setProcrastinationAlerts(alerts);
  }, []);

  const handleOrganizeDay = () => {
    const today = new Date(2026, 1, 14);
    const organization = organizeDayWithAI(mockTasks, today);
    setDayOrganization(organization);
    setShowOrganizeModal(true);
  };

  const handleProcrastinationAction = (type: string, taskId: string) => {
    console.log("Ação:", type, "para tarefa:", taskId);
    setProcrastinationAlerts(alerts => alerts.filter(a => a.taskId !== taskId));
  };

  return (
    <div className="p-6 md:p-8 space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <motion.h1
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl md:text-3xl font-semibold text-white mb-1 flex items-center gap-3"
          >
            Bem-vindo de volta
            <span className="px-2.5 py-0.5 bg-purple-500/10 text-purple-400 text-xs font-medium rounded-md">
              IA
            </span>
          </motion.h1>
          <p className="text-gray-400 text-sm">Resumo da sua produtividade</p>
        </div>

        {/* Botão Organizar Meu Dia */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          onClick={handleOrganizeDay}
          className="px-6 py-2.5 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium text-sm transition-colors flex items-center gap-2"
        >
          <Sparkles className="w-4 h-4" />
          Organizar dia
        </motion.button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-[#1a1a24]/50 backdrop-blur-sm border border-white/5 rounded-xl p-5 hover:border-white/10 transition-colors"
          >
            <div className="flex items-start justify-between mb-4">
              <div className={`p-2 rounded-lg bg-gradient-to-r ${stat.gradient} bg-opacity-10`}>
                <stat.icon className="w-5 h-5" style={{ color: stat.gradient.includes('emerald') ? '#10b981' : stat.gradient.includes('blue') ? '#3b82f6' : stat.gradient.includes('purple') ? '#8b5cf6' : '#f97316' }} />
              </div>
              <span className="text-xs font-medium text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-semibold text-white mb-0.5">{stat.value}</h3>
            <p className="text-sm text-gray-400">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Insights da IA */}
      <div>
        <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
          <Brain className="w-5 h-5 text-purple-400" />
          Análise Inteligente
        </h2>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <AIInsightCard
              key={index}
              type={insight.type}
              title={insight.title}
              message={insight.message}
              action={insight.action}
              actionLabel={insight.actionLabel}
              impact={insight.impact}
              onAction={() => console.log("Ação:", insight.action)}
            />
          ))}
        </div>
      </div>

      {/* Alertas de Procrastinação */}
      {procrastinationAlerts.length > 0 && (
        <div>
          <h2 className="text-xl font-semibold text-white mb-3 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-orange-400" />
            Alertas de Produtividade
          </h2>
          <div className="space-y-4">
            {procrastinationAlerts.map((alert) => (
              <ProcrastinationAlert
                key={alert.taskId}
                taskTitle={alert.taskTitle}
                daysPostponed={alert.daysPostponed}
                suggestion={alert.suggestion}
                actions={alert.actions}
                onAction={(type) => handleProcrastinationAction(type, alert.taskId)}
                onDismiss={() => setProcrastinationAlerts(alerts => alerts.filter(a => a.taskId !== alert.taskId))}
              />
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Tarefas Recentes */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="lg:col-span-2 bg-[#1a1a24]/50 backdrop-blur-sm border border-white/5 rounded-xl p-5"
        >
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-white flex items-center gap-2">
              <Activity className="w-5 h-5 text-purple-400" />
              Tarefas Recentes
            </h2>
            <button className="text-sm text-purple-400 hover:text-purple-300 font-medium transition-colors">
              Ver todas
            </button>
          </div>
          
          <div className="space-y-2">
            {recentTasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.05 }}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors group cursor-pointer"
              >
                <div className={`w-2 h-2 rounded-full ${
                  task.status === 'done' ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50' : 
                  task.status === 'in-progress' ? 'bg-blue-500 shadow-lg shadow-blue-500/50' : 
                  'bg-slate-500'
                }`}></div>
                
                <div className="flex-1">
                  <p className={`font-medium ${task.status === 'done' ? 'line-through text-slate-500' : 'text-white'}`}>
                    {task.title}
                  </p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className={`text-xs px-2 py-0.5 rounded-full border ${
                      task.priority === 'high' ? 'bg-red-500/10 border-red-500/30 text-red-400' :
                      task.priority === 'medium' ? 'bg-yellow-500/10 border-yellow-500/30 text-yellow-400' :
                      'bg-slate-500/10 border-slate-500/30 text-slate-400'
                    }`}>
                      {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                    </span>
                    <span className="text-xs text-slate-500">{task.dueDate}</span>
                  </div>
                </div>
                
                <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                  <CheckCircle2 className="w-5 h-5 text-slate-500 hover:text-emerald-500 transition-colors" />
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Próximos Eventos */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-[#1a1a24]/50 backdrop-blur-sm border border-white/5 rounded-xl p-5"
        >
          <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5 text-purple-400" />
            Próximos Eventos
          </h2>
          
          <div className="space-y-2">
            {upcomingEvents.map((event, index) => (
              <motion.div
                key={event.id}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4 + index * 0.05 }}
                className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/[0.03] transition-colors cursor-pointer"
              >
                <div className={`p-2 rounded-lg ${
                  event.type === 'meeting' ? 'bg-blue-500/20 border border-blue-500/30' :
                  event.type === 'deadline' ? 'bg-red-500/20 border border-red-500/30' : 
                  'bg-purple-500/20 border border-purple-500/30'
                }`}>
                  <Zap className={`w-4 h-4 ${
                    event.type === 'meeting' ? 'text-blue-400' :
                    event.type === 'deadline' ? 'text-red-400' : 'text-purple-400'
                  }`} />
                </div>
                <div className="flex-1">
                  <p className="font-medium text-sm text-white">{event.title}</p>
                  <p className="text-xs text-slate-400 mt-0.5">{event.time}</p>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Quick Stats */}
          <div className="mt-5 pt-5 border-t border-white/5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Progresso Semanal</span>
              <span className="text-sm font-semibold text-purple-400">68%</span>
            </div>
            <div className="w-full bg-white/5 rounded-full h-1.5 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "68%" }}
                transition={{ delay: 0.6, duration: 0.8 }}
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-1.5 rounded-full"
              />
            </div>
          </div>

          <motion.button
            whileHover={{ backgroundColor: "rgba(139, 92, 246, 0.1)" }}
            whileTap={{ scale: 0.98 }}
            className="w-full mt-4 px-4 py-2.5 bg-white/[0.03] border border-white/5 rounded-lg text-gray-300 text-sm font-medium hover:border-purple-500/30 transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Adicionar
          </motion.button>
        </motion.div>
      </div>

      {/* Gráfico de Produtividade */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-[#1a1a24]/50 backdrop-blur-sm border border-white/5 rounded-xl p-5"
      >
        <h2 className="text-lg font-semibold text-white mb-5 flex items-center gap-2">
          <BarChart3 className="w-5 h-5 text-purple-400" />
          Produtividade da Semana
        </h2>
        <div className="h-48 flex items-end justify-between gap-2">
          {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
            const heights = [60, 80, 70, 90, 85, 50, 40];
            return (
              <div key={day} className="flex-1 flex flex-col items-center gap-2">
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: `${heights[index]}%` }}
                  transition={{ delay: 0.5 + index * 0.08, duration: 0.4 }}
                  className="w-full bg-gradient-to-t from-purple-500 to-purple-400 rounded-lg min-h-[16px] hover:from-purple-400 hover:to-purple-300 transition-colors cursor-pointer relative group"
                >
                </motion.div>
                <span className="text-xs text-gray-500 font-medium">{day}</span>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Modal de Organização */}
      {dayOrganization && (
        <OrganizeDayModal
          isOpen={showOrganizeModal}
          onClose={() => setShowOrganizeModal(false)}
          organization={dayOrganization.organization}
          totalHours={dayOrganization.totalHours}
          overloadLevel={dayOrganization.overloadLevel}
          suggestion={dayOrganization.suggestion}
        />
      )}
    </div>
  );
}
