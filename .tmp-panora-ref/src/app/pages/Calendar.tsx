import { motion } from "motion/react";
import { useState } from "react";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus,
  Clock,
  MapPin,
  Brain,
  TrendingUp,
  AlertCircle
} from "lucide-react";
import { analyzeCalendarLoad } from "../services/aiEngine";

const events = [
  { id: 1, title: "Stand-up diário", time: "09:00", date: "2026-02-11", type: "meeting", color: "blue" },
  { id: 2, title: "Reunião de planejamento", time: "14:00", date: "2026-02-11", type: "meeting", color: "purple" },
  { id: 3, title: "Deadline - Projeto Alpha", time: "18:00", date: "2026-02-11", type: "deadline", color: "red" },
  { id: 4, title: "Sessão de estudo", time: "20:00", date: "2026-02-12", type: "study", color: "green" },
  { id: 5, title: "Code Review", time: "10:30", date: "2026-02-13", type: "meeting", color: "blue" },
  { id: 6, title: "Workshop de Design", time: "15:00", date: "2026-02-14", type: "workshop", color: "orange" },
  { id: 7, title: "Demo para Cliente", time: "16:00", date: "2026-02-15", type: "presentation", color: "purple" },
];

const mockTasks = [
  { 
    id: "1", 
    title: "Implementar autenticação", 
    status: "in-progress", 
    priority: "high", 
    dueDate: "2026-02-14",
    estimatedHours: 3
  },
  { 
    id: "2", 
    title: "Estudar React avançado", 
    status: "todo", 
    priority: "medium", 
    dueDate: "2026-02-14",
    estimatedHours: 2
  },
  { 
    id: "3", 
    title: "Reunião com equipe", 
    status: "todo", 
    priority: "high", 
    dueDate: "2026-02-14",
    estimatedHours: 1
  },
  { 
    id: "4", 
    title: "Revisar documentação", 
    status: "todo", 
    priority: "low", 
    dueDate: "2026-02-14",
    estimatedHours: 2
  },
];

const months = [
  "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
  "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
];

export function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 1, 11)); // February 11, 2026
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date(2026, 1, 14));
  const [dayAnalysis, setDayAnalysis] = useState<any>(null);

  const getDaysInMonth = (date: Date) => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();
    
    return { daysInMonth, startingDayOfWeek };
  };

  const { daysInMonth, startingDayOfWeek } = getDaysInMonth(currentDate);

  const getEventsForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    return events.filter(e => e.date === dateStr);
  };

  const previousMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const nextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const isToday = (day: number) => {
    const today = new Date(2026, 1, 11);
    return day === today.getDate() && 
           currentDate.getMonth() === today.getMonth() && 
           currentDate.getFullYear() === today.getFullYear();
  };

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    setSelectedDate(clickedDate);
    
    // Analisar carga do dia
    const analysis = analyzeCalendarLoad(mockTasks, clickedDate);
    setDayAnalysis(analysis);
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 mb-2 flex items-center gap-3">
            Calendário
            <span className="px-3 py-1 bg-gradient-to-r from-purple-500 to-purple-600 text-white text-sm rounded-full flex items-center gap-2">
              <Brain className="w-4 h-4" />
              Análise IA
            </span>
          </h1>
          <p className="text-slate-600">Gerencie seus eventos com análise inteligente de carga</p>
        </div>
        
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl font-medium shadow-lg shadow-purple-500/30 hover:shadow-xl hover:shadow-purple-500/40 transition-shadow"
        >
          <Plus className="w-5 h-5" />
          Novo Evento
        </motion.button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Calendar */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-lg border border-slate-100 p-6">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-slate-800">
              {months[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h2>
            <div className="flex gap-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={previousMonth}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronLeft className="w-5 h-5 text-slate-600" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={nextMonth}
                className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <ChevronRight className="w-5 h-5 text-slate-600" />
              </motion.button>
            </div>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-2">
            {/* Day Headers */}
            {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((day) => (
              <div key={day} className="text-center text-sm font-semibold text-slate-600 py-2">
                {day}
              </div>
            ))}

            {/* Empty cells for days before month starts */}
            {Array.from({ length: startingDayOfWeek }).map((_, index) => (
              <div key={`empty-${index}`} className="aspect-square" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }).map((_, index) => {
              const day = index + 1;
              const dayEvents = getEventsForDate(day);
              const today = isToday(day);
              const isSelected = selectedDate?.getDate() === day && 
                                selectedDate?.getMonth() === currentDate.getMonth();

              return (
                <motion.div
                  key={day}
                  whileHover={{ scale: 1.05 }}
                  onClick={() => handleDateClick(day)}
                  className={`aspect-square p-2 rounded-xl cursor-pointer transition-all ${
                    today
                      ? "bg-gradient-to-br from-purple-500 to-purple-600 text-white shadow-lg"
                      : isSelected
                      ? "bg-purple-100 border-2 border-purple-500"
                      : "hover:bg-slate-50"
                  }`}
                >
                  <div className={`text-sm font-semibold mb-1 ${today ? "text-white" : "text-slate-800"}`}>
                    {day}
                  </div>
                  <div className="space-y-1">
                    {dayEvents.slice(0, 2).map((event) => (
                      <div
                        key={event.id}
                        className={`text-xs px-1 py-0.5 rounded ${
                          today ? "bg-white/20" : `bg-${event.color}-100`
                        } ${today ? "text-white" : `text-${event.color}-700`} truncate`}
                      >
                        {event.title}
                      </div>
                    ))}
                    {dayEvents.length > 2 && (
                      <div className={`text-xs ${today ? "text-white/80" : "text-slate-500"}`}>
                        +{dayEvents.length - 2} mais
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Day Analysis Panel */}
        <div className="bg-white rounded-2xl shadow-lg border border-slate-100 p-6 space-y-6">
          <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
            <Brain className="w-6 h-6 text-purple-600" />
            Análise do Dia
          </h2>
          
          {dayAnalysis ? (
            <>
              {/* Stats rápidas */}
              <div className="space-y-3">
                <div className="bg-gradient-to-br from-purple-50 to-purple-50 border border-purple-200 rounded-xl p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Carga Total</span>
                    <Clock className="w-4 h-4 text-purple-600" />
                  </div>
                  <p className="text-3xl font-bold text-slate-800">{dayAnalysis.totalHours}h</p>
                  <p className="text-xs text-slate-500 mt-1">{dayAnalysis.taskCount} tarefas</p>
                </div>

                <div className={`rounded-xl p-4 border ${
                  dayAnalysis.overloadScore > 80 ? 'bg-red-50 border-red-200' :
                  dayAnalysis.overloadScore > 50 ? 'bg-yellow-50 border-yellow-200' :
                  'bg-green-50 border-green-200'
                }`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm text-slate-600">Nível de Sobrecarga</span>
                    <AlertCircle className={`w-4 h-4 ${
                      dayAnalysis.overloadScore > 80 ? 'text-red-600' :
                      dayAnalysis.overloadScore > 50 ? 'text-yellow-600' :
                      'text-green-600'
                    }`} />
                  </div>
                  <div className="flex items-baseline gap-2">
                    <p className={`text-3xl font-bold ${
                      dayAnalysis.overloadScore > 80 ? 'text-red-600' :
                      dayAnalysis.overloadScore > 50 ? 'text-yellow-600' :
                      'text-green-600'
                    }`}>
                      {Math.round(dayAnalysis.overloadScore)}%
                    </p>
                  </div>
                  <div className="w-full bg-white rounded-full h-2 mt-2">
                    <div 
                      className={`h-2 rounded-full ${
                        dayAnalysis.overloadScore > 80 ? 'bg-red-500' :
                        dayAnalysis.overloadScore > 50 ? 'bg-yellow-500' :
                        'bg-green-500'
                      }`}
                      style={{ width: `${dayAnalysis.overloadScore}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Melhor horário de foco */}
              <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-semibold text-slate-800">Melhor Horário de Foco</span>
                </div>
                <p className="text-lg font-bold text-blue-600">{dayAnalysis.bestFocusTime}</p>
                <p className="text-xs text-slate-600 mt-1">Baseado no seu histórico de produtividade</p>
              </div>

              {/* Sugestões de redistribuição */}
              {dayAnalysis.redistribution && dayAnalysis.redistribution.length > 0 && (
                <div className="border-t border-slate-200 pt-4">
                  <h3 className="font-bold text-slate-800 mb-3 flex items-center gap-2">
                    <Brain className="w-5 h-5 text-purple-600" />
                    Sugestões IA
                  </h3>
                  <div className="space-y-3">
                    {dayAnalysis.redistribution.map((suggestion: any, index: number) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="bg-gradient-to-r from-orange-50 to-red-50 border border-orange-200 rounded-xl p-3"
                      >
                        <p className="font-medium text-sm text-slate-800 mb-1">{suggestion.taskTitle}</p>
                        <p className="text-xs text-slate-600 mb-2">{suggestion.reason}</p>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-orange-600 font-medium">
                            Sugestão: Mover para {new Date(suggestion.suggestedDate).toLocaleDateString('pt-BR')}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <Brain className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-600">Selecione um dia para ver a análise inteligente</p>
            </div>
          )}

          {/* Upcoming Events */}
          <div className="border-t border-slate-200 pt-4">
            <h3 className="font-bold text-slate-800 mb-3">Próximos Eventos</h3>
            <div className="space-y-3">
              {events.slice(0, 5).map((event, index) => (
                <motion.div
                  key={event.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
                >
                  <div className={`w-1 bg-gradient-to-b from-${event.color}-500 to-${event.color}-600 rounded-full`}></div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-slate-800 group-hover:text-purple-600 transition-colors text-sm">
                      {event.title}
                    </h3>
                    <div className="flex items-center gap-3 mt-1 text-xs text-slate-600">
                      <div className="flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        <span>{event.time}</span>
                      </div>
                      <span>
                        {new Date(event.date).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })}
                      </span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}