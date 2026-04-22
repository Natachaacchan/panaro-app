// Motor de IA simulado - preparado para integração com OpenAI API

interface Task {
  id: string;
  title: string;
  status: string;
  priority: string;
  dueDate: string;
  completedAt?: string;
  postponedCount?: number;
  estimatedHours?: number;
}

interface AIInsight {
  type: "productivity" | "pattern" | "warning" | "suggestion";
  title: string;
  message: string;
  action?: string;
  actionLabel?: string;
  impact: "high" | "medium" | "low";
}

interface DayOrganization {
  timeBlock: string;
  taskId: string;
  taskTitle: string;
  reason: string;
  focusLevel: "high" | "medium" | "low";
}

interface ProcrastinationAlert {
  taskId: string;
  taskTitle: string;
  daysPostponed: number;
  suggestion: string;
  actions: Array<{ type: string; label: string }>;
}

// Simulação de análise de produtividade
export function analyzeProductivity(tasks: Task[]): AIInsight[] {
  const completedTasks = tasks.filter(t => t.status === "done");
  const completedThisWeek = completedTasks.filter(t => {
    if (!t.completedAt) return false;
    const completedDate = new Date(t.completedAt);
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    return completedDate > weekAgo;
  });

  const insights: AIInsight[] = [];

  // Insight 1: Comparação semanal
  const improvement = Math.floor(Math.random() * 30) + 10;
  insights.push({
    type: "productivity",
    title: "Análise Semanal",
    message: `Você está ${improvement}% mais produtivo que na semana passada. Seus maiores ganhos vieram em projetos de desenvolvimento.`,
    impact: "high"
  });

  // Insight 2: Padrão detectado
  insights.push({
    type: "pattern",
    title: "Padrão Identificado",
    message: "Você completa 73% mais tarefas entre 9h-12h. Considere agendar atividades complexas nesse período.",
    impact: "medium"
  });

  // Insight 3: Alerta de sobrecarga
  const overdueTasks = tasks.filter(t => {
    const dueDate = new Date(t.dueDate);
    return dueDate < new Date() && t.status !== "done";
  });

  if (overdueTasks.length > 3) {
    insights.push({
      type: "warning",
      title: "Sobrecarga Detectada",
      message: `Você tem ${overdueTasks.length} tarefas atrasadas. Recomendo redistribuir ou delegar.`,
      action: "reorganize",
      actionLabel: "Reorganizar Automaticamente",
      impact: "high"
    });
  }

  // Insight 4: Sugestão estratégica
  insights.push({
    type: "suggestion",
    title: "Otimização Sugerida",
    message: "Suas tarefas de estudo têm melhor performance após 20h. Ajuste seu calendário para aproveitar esse padrão.",
    action: "adjust-schedule",
    actionLabel: "Aplicar Sugestão",
    impact: "medium"
  });

  return insights;
}

// Organização inteligente do dia
export function organizeDayWithAI(tasks: Task[], date: Date): {
  organization: DayOrganization[];
  totalHours: number;
  overloadLevel: "low" | "medium" | "high";
  suggestion: string;
} {
  const dayTasks = tasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    return taskDate.toDateString() === date.toDateString() && t.status !== "done";
  });

  // Ordenar por prioridade e urgência
  const sortedTasks = dayTasks.sort((a, b) => {
    const priorityWeight = { high: 3, medium: 2, low: 1 };
    return priorityWeight[b.priority as keyof typeof priorityWeight] - 
           priorityWeight[a.priority as keyof typeof priorityWeight];
  });

  const organization: DayOrganization[] = [];
  let currentHour = 9;

  sortedTasks.forEach((task, index) => {
    const estimatedHours = task.estimatedHours || 1;
    let focusLevel: "high" | "medium" | "low" = "medium";
    let reason = "";

    // Determinar melhor horário baseado em padrões
    if (currentHour >= 9 && currentHour < 12) {
      focusLevel = "high";
      reason = "Período de máximo foco matinal - ideal para tarefas complexas";
    } else if (currentHour >= 14 && currentHour < 16) {
      focusLevel = "medium";
      reason = "Período de foco moderado - bom para tarefas de média complexidade";
    } else {
      focusLevel = "low";
      reason = "Período de foco reduzido - recomendado para tarefas simples";
    }

    organization.push({
      timeBlock: `${currentHour}:00 - ${currentHour + estimatedHours}:00`,
      taskId: task.id,
      taskTitle: task.title,
      reason,
      focusLevel
    });

    currentHour += estimatedHours;
  });

  const totalHours = sortedTasks.reduce((sum, t) => sum + (t.estimatedHours || 1), 0);
  let overloadLevel: "low" | "medium" | "high" = "low";
  let suggestion = "";

  if (totalHours > 8) {
    overloadLevel = "high";
    suggestion = `Dia sobrecarregado (${totalHours}h). Recomendo mover 3 tarefas de baixa prioridade para amanhã.`;
  } else if (totalHours > 6) {
    overloadLevel = "medium";
    suggestion = `Dia moderado (${totalHours}h). Planeje intervalos entre tarefas para manter o foco.`;
  } else {
    overloadLevel = "low";
    suggestion = `Dia balanceado (${totalHours}h). Você pode adicionar 1-2 tarefas extras se desejar.`;
  }

  return { organization, totalHours, overloadLevel, suggestion };
}

// Detecção de procrastinação
export function detectProcrastination(tasks: Task[]): ProcrastinationAlert[] {
  const alerts: ProcrastinationAlert[] = [];

  tasks.forEach(task => {
    const postponedCount = task.postponedCount || 0;
    
    if (postponedCount >= 3) {
      alerts.push({
        taskId: task.id,
        taskTitle: task.title,
        daysPostponed: postponedCount,
        suggestion: "Esta tarefa está sendo adiada há vários dias. Considere dividir em partes menores ou redefinir o prazo.",
        actions: [
          { type: "break-down", label: "Quebrar em Subtarefas" },
          { type: "reschedule", label: "Remarcar Estrategicamente" },
          { type: "delegate", label: "Considerar Delegação" }
        ]
      });
    }
  });

  // Detectar tarefas abandonadas (sem atualização há muito tempo)
  tasks.forEach(task => {
    const taskDate = new Date(task.dueDate);
    const daysSinceCreation = Math.floor((Date.now() - taskDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (daysSinceCreation > 14 && task.status === "todo") {
      alerts.push({
        taskId: task.id,
        taskTitle: task.title,
        daysPostponed: daysSinceCreation,
        suggestion: "Esta tarefa está inativa há mais de 2 semanas. Ainda é relevante?",
        actions: [
          { type: "archive", label: "Arquivar" },
          { type: "reactivate", label: "Reativar com Nova Data" },
          { type: "delete", label: "Remover" }
        ]
      });
    }
  });

  return alerts;
}

// Análise de carga do calendário
export function analyzeCalendarLoad(tasks: Task[], date: Date): {
  totalHours: number;
  taskCount: number;
  overloadScore: number;
  bestFocusTime: string;
  redistribution: Array<{ taskId: string; taskTitle: string; suggestedDate: string; reason: string }>;
} {
  const dayTasks = tasks.filter(t => {
    const taskDate = new Date(t.dueDate);
    return taskDate.toDateString() === date.toDateString() && t.status !== "done";
  });

  const totalHours = dayTasks.reduce((sum, t) => sum + (t.estimatedHours || 1), 0);
  const taskCount = dayTasks.length;
  const overloadScore = Math.min(100, (totalHours / 8) * 100);

  // Baseado em padrões históricos (simulado)
  const bestFocusTime = "09:00 - 12:00";

  // Sugestões de redistribuição se sobrecarregado
  const redistribution: Array<{ taskId: string; taskTitle: string; suggestedDate: string; reason: string }> = [];

  if (overloadScore > 80) {
    // Pegar tarefas de baixa prioridade para mover
    const lowPriorityTasks = dayTasks.filter(t => t.priority === "low").slice(0, 2);
    
    lowPriorityTasks.forEach(task => {
      const tomorrow = new Date(date);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      redistribution.push({
        taskId: task.id,
        taskTitle: task.title,
        suggestedDate: tomorrow.toISOString().split('T')[0],
        reason: "Movido para reduzir sobrecarga e permitir foco nas prioridades de hoje"
      });
    });
  }

  return {
    totalHours,
    taskCount,
    overloadScore,
    bestFocusTime,
    redistribution
  };
}

// Sugestão de quebra de tarefas grandes
export function breakDownTask(task: Task): Array<{ title: string; estimatedHours: number }> {
  // Simulação de quebra inteligente
  const subtasks = [
    { title: `${task.title} - Planejamento e pesquisa`, estimatedHours: 0.5 },
    { title: `${task.title} - Desenvolvimento principal`, estimatedHours: 1.5 },
    { title: `${task.title} - Revisão e ajustes`, estimatedHours: 0.5 },
    { title: `${task.title} - Testes e finalização`, estimatedHours: 0.5 }
  ];

  return subtasks;
}
