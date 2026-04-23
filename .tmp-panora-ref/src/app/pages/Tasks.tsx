import { motion } from "motion/react";
import { useState } from "react";
import { 
  LayoutList, 
  LayoutGrid, 
  Plus,
  Filter,
  SortAsc,
  MoreVertical,
  Calendar,
  Flag
} from "lucide-react";
import { DndProvider, useDrag, useDrop } from "react-dnd";
import { HTML5Backend } from "react-dnd-html5-backend";

type ViewMode = "list" | "kanban";

interface Task {
  id: string;
  title: string;
  description: string;
  status: "todo" | "in-progress" | "review" | "done";
  priority: "low" | "medium" | "high";
  dueDate: string;
  tags: string[];
}

const initialTasks: Task[] = [
  {
    id: "1",
    title: "Implementar autenticação",
    description: "Adicionar login e registro de usuários",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-02-15",
    tags: ["desenvolvimento", "backend"]
  },
  {
    id: "2",
    title: "Design do dashboard",
    description: "Criar wireframes e protótipo",
    status: "review",
    priority: "medium",
    dueDate: "2026-02-12",
    tags: ["design", "ui/ux"]
  },
  {
    id: "3",
    title: "Estudar React Hooks",
    description: "Completar curso sobre hooks avançados",
    status: "todo",
    priority: "medium",
    dueDate: "2026-02-20",
    tags: ["estudo", "react"]
  },
  {
    id: "4",
    title: "Revisar pull requests",
    description: "Revisar PRs pendentes da equipe",
    status: "todo",
    priority: "high",
    dueDate: "2026-02-11",
    tags: ["código", "revisão"]
  },
  {
    id: "5",
    title: "Atualizar documentação",
    description: "Documentar novas features",
    status: "done",
    priority: "low",
    dueDate: "2026-02-10",
    tags: ["documentação"]
  },
  {
    id: "6",
    title: "Configurar CI/CD",
    description: "Setup pipeline de deploy automático",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-02-14",
    tags: ["devops", "infraestrutura"]
  },
];

const columns = [
  { id: "todo", label: "A Fazer", color: "slate" },
  { id: "in-progress", label: "Em Progresso", color: "blue" },
  { id: "review", label: "Revisão", color: "yellow" },
  { id: "done", label: "Concluído", color: "green" },
];

interface TaskCardProps {
  task: Task;
  onDrop?: (taskId: string, newStatus: string) => void;
}

function TaskCard({ task, onDrop }: TaskCardProps) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: "TASK",
    item: { id: task.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }));

  const priorityColors = {
    low: "text-slate-600 bg-slate-100",
    medium: "text-yellow-600 bg-yellow-100",
    high: "text-red-600 bg-red-100",
  };

  return (
    <motion.div
      ref={drag}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: isDragging ? 0.5 : 1, y: 0 }}
      whileHover={{ y: -2 }}
      className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all cursor-move group"
    >
      <div className="flex items-start justify-between mb-3">
        <h3 className="font-semibold text-slate-800 flex-1 pr-2">{task.title}</h3>
        <button className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-slate-100 rounded">
          <MoreVertical className="w-4 h-4 text-slate-400" />
        </button>
      </div>
      
      <p className="text-sm text-slate-600 mb-3">{task.description}</p>
      
      <div className="flex items-center gap-2 mb-3">
        {task.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-purple-50 text-purple-600 rounded-lg"
          >
            {tag}
          </span>
        ))}
      </div>
      
      <div className="flex items-center justify-between text-xs">
        <div className="flex items-center gap-2">
          <Calendar className="w-3 h-3 text-slate-400" />
          <span className="text-slate-600">{new Date(task.dueDate).toLocaleDateString('pt-BR')}</span>
        </div>
        <span className={`px-2 py-1 rounded-lg font-medium ${priorityColors[task.priority]}`}>
          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
        </span>
      </div>
    </motion.div>
  );
}

interface KanbanColumnProps {
  column: typeof columns[0];
  tasks: Task[];
  onDrop: (taskId: string, newStatus: string) => void;
}

function KanbanColumn({ column, tasks, onDrop }: KanbanColumnProps) {
  const [{ isOver }, drop] = useDrop(() => ({
    accept: "TASK",
    drop: (item: { id: string }) => onDrop(item.id, column.id),
    collect: (monitor) => ({
      isOver: monitor.isOver(),
    }),
  }));

  const colorClasses = {
    slate: "from-slate-500 to-slate-600",
    blue: "from-blue-500 to-blue-600",
    yellow: "from-yellow-500 to-orange-600",
    green: "from-green-500 to-emerald-600",
  };

  return (
    <div
      ref={drop}
      className={`flex-1 min-w-[300px] ${isOver ? 'bg-purple-50' : ''} rounded-2xl transition-colors`}
    >
      <div className="mb-4">
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r ${colorClasses[column.color as keyof typeof colorClasses]} text-white shadow-lg`}>
          <span className="font-bold">{column.label}</span>
          <span className="bg-white/20 px-2 py-0.5 rounded-full text-sm">{tasks.length}</span>
        </div>
      </div>
      
      <div className="space-y-3">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} onDrop={onDrop} />
        ))}
      </div>
    </div>
  );
}

export function Tasks() {
  const [viewMode, setViewMode] = useState<ViewMode>("kanban");
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleTaskDrop = (taskId: string, newStatus: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus as Task["status"] } : task
      )
    );
  };

  const tasksByStatus = (status: string) =>
    tasks.filter((task) => task.status === status);

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 mb-2">Tarefas</h1>
            <p className="text-slate-600">Gerencie suas tarefas e acompanhe o progresso</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-white rounded-xl p-1 shadow-lg border border-slate-200">
              <button
                onClick={() => setViewMode("list")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "list"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <LayoutList className="w-5 h-5" />
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`p-2 rounded-lg transition-all ${
                  viewMode === "kanban"
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <LayoutGrid className="w-5 h-5" />
              </button>
            </div>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-lg border border-slate-200">
              <Filter className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-700">Filtrar</span>
            </button>
            
            <button className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl hover:bg-slate-50 transition-colors shadow-lg border border-slate-200">
              <SortAsc className="w-5 h-5 text-slate-600" />
              <span className="font-medium text-slate-700">Ordenar</span>
            </button>
            
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow"
            >
              <Plus className="w-5 h-5" />
              Nova Tarefa
            </motion.button>
          </div>
        </div>

        {/* Content */}
        {viewMode === "kanban" ? (
          <div className="flex gap-6 overflow-x-auto pb-4">
            {columns.map((column) => (
              <KanbanColumn
                key={column.id}
                column={column}
                tasks={tasksByStatus(column.id)}
                onDrop={handleTaskDrop}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-2xl shadow-lg border border-slate-200">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tarefa</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Status</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Prioridade</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Data</th>
                    <th className="px-6 py-4 text-left text-sm font-semibold text-slate-700">Tags</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {tasks.map((task) => (
                    <motion.tr
                      key={task.id}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="hover:bg-slate-50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div>
                          <p className="font-semibold text-slate-800">{task.title}</p>
                          <p className="text-sm text-slate-600">{task.description}</p>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm font-medium">
                          {columns.find(c => c.id === task.status)?.label}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-lg text-sm font-medium ${
                          task.priority === 'high' ? 'bg-red-100 text-red-700' :
                          task.priority === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-slate-100 text-slate-700'
                        }`}>
                          {task.priority === 'high' ? 'Alta' : task.priority === 'medium' ? 'Média' : 'Baixa'}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {new Date(task.dueDate).toLocaleDateString('pt-BR')}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex gap-1">
                          {task.tags.map((tag) => (
                            <span key={tag} className="px-2 py-1 bg-purple-50 text-purple-600 rounded text-xs">
                              {tag}
                            </span>
                          ))}
                        </div>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </DndProvider>
  );
}
