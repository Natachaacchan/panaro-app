import {
  getProjectStatusLabel,
  getRecentNotes,
  getTaskStatusLabel,
  getUpcomingEvents,
  useWorkspaceData,
} from "../hooks/useWorkspaceData";
import type { Task } from "../types/workspace";

const statMeta = [
  { label: "Tarefas abertas", key: "totalTasks" as const, tone: "violet" },
  { label: "Projetos ativos", key: "activeProjects" as const, tone: "blue" },
  { label: "Entregas", key: "weeklyDeliveries" as const, tone: "pink" },
  { label: "Bloqueios", key: "blockedTasks" as const, tone: "amber" },
];

function isTaskOverdue(task: Task) {
  if (!task.dueDate || task.status === "done") {
    return false;
  }

  return task.dueDate < new Date().toISOString().slice(0, 10);
}

export function Dashboard() {
  const workspace = useWorkspaceData();
  const recentNotes = getRecentNotes(workspace.notes);
  const upcomingEvents = getUpcomingEvents(workspace.events);
  const highlightedProjects = workspace.projects.slice(0, 3);
  const highlightedTasks = workspace.tasks.slice(0, 4);
  const overdueTasks = workspace.tasks.filter(isTaskOverdue);
  const inProgressTasks = workspace.tasks.filter((task) => task.status === "in_progress");
  const completedTasks = workspace.tasks.filter((task) => task.status === "done");
  const atRiskProjects = workspace.projects.filter((project) => project.status === "at_risk");
  const productivityScore = Math.min(
    100,
    completedTasks.length * 12 + upcomingEvents.length * 8 + workspace.notes.length * 4
  );

  const isEmpty =
    workspace.tasks.length === 0 &&
    workspace.projects.length === 0 &&
    workspace.notes.length === 0 &&
    workspace.events.length === 0;

  return (
    <section className="page">
      <div className="page-hero page-hero--dashboard">
        <div>
          <p className="eyebrow">Dashboard</p>
          <h1>Resumo geral da sua rotina.</h1>
          <p className="page-copy">
            Veja progresso, atrasos, agenda e contexto sem precisar abrir cada area.
          </p>
        </div>
        <div className="hero-spotlight hero-spotlight--dashboard">
          <span>Score operacional</span>
          <strong>{productivityScore}</strong>
          <small>
            {overdueTasks.length} atrasadas • {inProgressTasks.length} em andamento •{" "}
            {workspace.events.length} eventos
          </small>
        </div>
      </div>

      <div className="stats-grid">
        {statMeta.map((item) => (
          <article key={item.key} className={`stat-card stat-card--${item.tone}`}>
            <span>{item.label}</span>
            <strong>{workspace.metrics[item.key]}</strong>
            <small>
              {item.key === "totalTasks"
                ? "Mostra o que ainda precisa de atencao."
                : item.key === "activeProjects"
                  ? "Resume quantos projetos seguem em execucao."
                  : item.key === "weeklyDeliveries"
                    ? "Aponta entregas e compromissos programados."
                    : "Indica o que esta travando seu fluxo."}
            </small>
          </article>
        ))}
      </div>

      {isEmpty ? (
        <section className="empty-state empty-state--hero">
          <p className="eyebrow">Vazio</p>
          <h2>Nenhum dado ainda.</h2>
          <p className="page-copy">Crie o primeiro item.</p>
        </section>
      ) : null}

      <div className="dashboard-spotlight-grid">
        <article className="dashboard-spotlight-card dashboard-spotlight-card--progress">
          <p className="eyebrow">Agora</p>
          <h3>Fluxo de execucao</h3>
          <p className="row-copy">
            Aqui voce enxerga rapidamente o que esta andando, o que ja terminou e quanta
            informacao nova entrou no workspace.
          </p>
          <div className="dashboard-kpis">
            <div>
              <strong>{inProgressTasks.length}</strong>
              <span>tarefas em progresso</span>
            </div>
            <div>
              <strong>{completedTasks.length}</strong>
              <span>concluidas</span>
            </div>
            <div>
              <strong>{recentNotes.length}</strong>
              <span>notas recentes</span>
            </div>
          </div>
        </article>

        <article className="dashboard-spotlight-card dashboard-spotlight-card--alert">
          <p className="eyebrow">Atencao</p>
          <h3>Riscos e atrasos</h3>
          <p className="row-copy">
            Este bloco destaca o que precisa de resposta mais rapida para evitar atraso ou perda
            de contexto.
          </p>
          <div className="dashboard-alert-stack">
            <div className="dashboard-alert-pill">
              <strong>{overdueTasks.length}</strong>
              <span>tarefas atrasadas</span>
            </div>
            <div className="dashboard-alert-pill">
              <strong>{atRiskProjects.length}</strong>
              <span>projetos em risco</span>
            </div>
            <div className="dashboard-alert-pill">
              <strong>{workspace.metrics.blockedTasks}</strong>
              <span>bloqueios ativos</span>
            </div>
          </div>
        </article>
      </div>

      <div className="panel-grid">
        <article className="list-card">
          <div className="list-card__header">
            <p className="eyebrow">Pipeline</p>
            <h3>Prioridades em movimento</h3>
            <p className="row-copy">Lista simples das tarefas mais recentes para voce agir sem sair da visao geral.</p>
          </div>
          {highlightedTasks.length > 0 ? (
            highlightedTasks.map((task) => (
              <div key={task.id} className="list-row list-row--interactive">
                <div>
                  <strong>{task.title}</strong>
                  <p className="row-copy">
                    {task.owner} • entrega {task.dueDate}
                    {isTaskOverdue(task) ? " • atrasada" : ""}
                  </p>
                </div>
                <span className={`tag tag--${task.priority}`}>{getTaskStatusLabel(task.status)}</span>
              </div>
            ))
          ) : (
            <div className="list-row">
              <p className="row-copy">Sem tarefas.</p>
            </div>
          )}
        </article>

        <article className="list-card">
          <div className="list-card__header">
            <p className="eyebrow">Radar</p>
            <h3>Eventos e entregas proximos</h3>
            <p className="row-copy">Mostra compromissos e entregas para voce antecipar a semana.</p>
          </div>
          {upcomingEvents.length > 0 ? (
            upcomingEvents.map((event) => (
              <div key={event.id} className="list-row list-row--interactive">
                <div>
                  <strong>{event.title}</strong>
                  <p className="row-copy">{event.dateLabel}</p>
                </div>
                <span className="tag tag--muted">{event.kind}</span>
              </div>
            ))
          ) : (
            <div className="list-row">
              <p className="row-copy">Sem eventos.</p>
            </div>
          )}
        </article>
      </div>

      <div className="panel-grid panel-grid--two-columns">
        <article className="panel-card list-card">
          <div className="list-card__header">
            <p className="eyebrow">Projetos</p>
            <h3>Visao executiva</h3>
            <p className="row-copy">Resume os projetos principais, o status atual e o proximo marco.</p>
          </div>
          {highlightedProjects.length > 0 ? (
            highlightedProjects.map((project) => (
              <div key={project.id} className="list-row list-row--stacked list-row--interactive">
                <div className="row-spread">
                  <strong>{project.name}</strong>
                  <span className="tag tag--muted">{getProjectStatusLabel(project.status)}</span>
                </div>
                <p className="row-copy">{project.summary}</p>
                <div className="progress-block">
                  <small>Marco: {project.nextMilestone}</small>
                  <div className="progress-track">
                    <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="list-row">
              <p className="row-copy">Sem projetos.</p>
            </div>
          )}
        </article>

        <article className="panel-card list-card">
          <div className="list-card__header">
            <p className="eyebrow">Notas</p>
            <h3>Contexto rapido</h3>
            <p className="row-copy">Reune ideias e registros recentes para voce retomar o contexto com facilidade.</p>
          </div>
          {recentNotes.length > 0 ? (
            recentNotes.map((note) => (
              <div key={note.id} className="list-row list-row--stacked list-row--interactive">
                <div className="row-spread">
                  <strong>{note.title}</strong>
                  <span className="tag tag--muted">{note.category}</span>
                </div>
                <p className="row-copy">{note.summary}</p>
                <small className="row-copy">Atualizada em {note.updatedAt}</small>
              </div>
            ))
          ) : (
            <div className="list-row">
              <p className="row-copy">Sem notas.</p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}

export default Dashboard;
