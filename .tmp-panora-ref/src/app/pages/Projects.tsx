import { motion } from "motion/react";
import { 
  Plus, 
  MoreVertical, 
  Users, 
  Calendar,
  TrendingUp,
  Folder,
  Star,
  Clock
} from "lucide-react";

const projects = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Redesenhar completamente o site institucional",
    progress: 75,
    color: "from-purple-500 to-purple-600",
    members: 5,
    tasks: { total: 24, completed: 18 },
    dueDate: "2026-03-01",
    status: "on-track"
  },
  {
    id: 2,
    name: "App Mobile",
    description: "Desenvolvimento do aplicativo mobile",
    progress: 45,
    color: "from-blue-500 to-cyan-600",
    members: 8,
    tasks: { total: 32, completed: 14 },
    dueDate: "2026-04-15",
    status: "on-track"
  },
  {
    id: 3,
    name: "Sistema de Analytics",
    description: "Dashboard de analytics em tempo real",
    progress: 30,
    color: "from-green-500 to-emerald-600",
    members: 4,
    tasks: { total: 20, completed: 6 },
    dueDate: "2026-05-01",
    status: "at-risk"
  },
  {
    id: 4,
    name: "API REST v2",
    description: "Nova versão da API com GraphQL",
    progress: 60,
    color: "from-orange-500 to-red-600",
    members: 6,
    tasks: { total: 28, completed: 17 },
    dueDate: "2026-03-20",
    status: "on-track"
  },
  {
    id: 5,
    name: "Design System",
    description: "Biblioteca de componentes reutilizáveis",
    progress: 90,
    color: "from-pink-500 to-rose-600",
    members: 3,
    tasks: { total: 15, completed: 13 },
    dueDate: "2026-02-28",
    status: "ahead"
  },
  {
    id: 6,
    name: "Plataforma de E-learning",
    description: "Portal de cursos online",
    progress: 20,
    color: "from-indigo-500 to-purple-600",
    members: 7,
    tasks: { total: 40, completed: 8 },
    dueDate: "2026-06-01",
    status: "on-track"
  },
];

export function Projects() {
  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2">Projetos</h1>
          <p className="text-slate-600">Acompanhe todos os seus projetos em andamento</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Novo Projeto
        </motion.button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: "Total de Projetos", value: "6", icon: Folder, color: "purple" },
          { label: "Em Andamento", value: "5", icon: TrendingUp, color: "blue" },
          { label: "Concluídos", value: "12", icon: Star, color: "green" },
          { label: "Atrasados", value: "1", icon: Clock, color: "red" },
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className="bg-white rounded-2xl p-6 shadow-lg border border-slate-100"
          >
            <div className={`inline-flex p-3 rounded-xl bg-${stat.color}-50 mb-4`}>
              <stat.icon className={`w-6 h-6 text-${stat.color}-600`} />
            </div>
            <h3 className="text-3xl font-bold text-slate-800 mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-600">{stat.label}</p>
          </motion.div>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            whileHover={{ y: -4 }}
            className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all border border-slate-100 overflow-hidden group cursor-pointer"
          >
            {/* Project Header */}
            <div className={`h-2 bg-gradient-to-r ${project.color}`}></div>
            
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-bold text-lg text-slate-800 mb-1 group-hover:text-purple-600 transition-colors">
                    {project.name}
                  </h3>
                  <p className="text-sm text-slate-600">{project.description}</p>
                </div>
                <button className="opacity-0 group-hover:opacity-100 transition-opacity p-2 hover:bg-slate-100 rounded-lg">
                  <MoreVertical className="w-5 h-5 text-slate-400" />
                </button>
              </div>

              {/* Progress */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progresso</span>
                  <span className="text-sm font-bold text-purple-600">{project.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${project.progress}%` }}
                    transition={{ delay: 0.3 + index * 0.1, duration: 1 }}
                    className={`bg-gradient-to-r ${project.color} h-2 rounded-full`}
                  />
                </div>
              </div>

              {/* Tasks */}
              <div className="flex items-center gap-4 mb-4 text-sm">
                <div>
                  <span className="text-slate-600">Tarefas: </span>
                  <span className="font-semibold text-slate-800">
                    {project.tasks.completed}/{project.tasks.total}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  <span className="font-semibold text-slate-800">{project.members}</span>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-100">
                <div className="flex items-center gap-2 text-sm text-slate-600">
                  <Calendar className="w-4 h-4" />
                  <span>{new Date(project.dueDate).toLocaleDateString('pt-BR')}</span>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                  project.status === 'ahead' ? 'bg-green-100 text-green-700' :
                  project.status === 'on-track' ? 'bg-blue-100 text-blue-700' :
                  'bg-red-100 text-red-700'
                }`}>
                  {project.status === 'ahead' ? 'Adiantado' :
                   project.status === 'on-track' ? 'No prazo' :
                   'Atrasado'}
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
