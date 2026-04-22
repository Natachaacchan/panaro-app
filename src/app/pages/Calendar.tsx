import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import {
  getProjectName,
  getTaskStatusLabel,
  groupTasksByStatus,
  useWorkspaceData,
} from "../hooks/useWorkspaceData";
import type { Task, TaskStatus, WorkspaceEvent } from "../types/workspace";

const weekdayLabels = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];
const monthLabels = [
  "Janeiro",
  "Fevereiro",
  "Marco",
  "Abril",
  "Maio",
  "Junho",
  "Julho",
  "Agosto",
  "Setembro",
  "Outubro",
  "Novembro",
  "Dezembro",
];
const statusOptions: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];

function getMonthGrid(baseDate: Date) {
  const year = baseDate.getFullYear();
  const month = baseDate.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startOffset = firstDay.getDay();

  return Array.from({ length: startOffset + lastDay.getDate() }, (_, index) => {
    const dayNumber = index - startOffset + 1;

    if (dayNumber <= 0) {
      return null;
    }

    const current = new Date(year, month, dayNumber);
    return {
      key: current.toISOString().slice(0, 10),
      dayNumber,
      isToday: current.toISOString().slice(0, 10) === new Date().toISOString().slice(0, 10),
    };
  });
}

function formatShortDate(dateKey: string) {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "numeric",
    month: "short",
  }).format(new Date(`${dateKey}T00:00:00`));
}

export function Calendar() {
  const workspace = useWorkspaceData();
  const [currentDate, setCurrentDate] = useState(() => new Date());
  const [selectedDate, setSelectedDate] = useState(() => new Date().toISOString().slice(0, 10));
  const [eventTitle, setEventTitle] = useState("");
  const [taskTitle, setTaskTitle] = useState("");
  const [projectId, setProjectId] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");
  const [kind, setKind] = useState<WorkspaceEvent["kind"]>("focus");
  const groupedTasks = useMemo(() => groupTasksByStatus(workspace.tasks), [workspace.tasks]);

  const monthGrid = useMemo(() => getMonthGrid(currentDate), [currentDate]);
  const eventsByDate = useMemo(
    () =>
      workspace.events.reduce<Record<string, WorkspaceEvent[]>>((accumulator, event) => {
        const key = event.dateKey || "";
        if (!key) {
          return accumulator;
        }

        accumulator[key] = [...(accumulator[key] ?? []), event];
        return accumulator;
      }, {}),
    [workspace.events]
  );

  const tasksByDate = useMemo(
    () =>
      workspace.tasks.reduce<Record<string, Task[]>>((accumulator, task) => {
        if (!task.dueDate) {
          return accumulator;
        }

        accumulator[task.dueDate] = [...(accumulator[task.dueDate] ?? []), task];
        return accumulator;
      }, {}),
    [workspace.tasks]
  );

  const selectedEvents = eventsByDate[selectedDate] ?? [];
  const selectedTasks = tasksByDate[selectedDate] ?? [];
  const upcomingItems = useMemo(
    () =>
      [
        ...workspace.events.map((event) => ({
          id: event.id,
          title: event.title,
          dateKey: event.dateKey || "",
          type: event.kind,
          accent:
            event.kind === "delivery"
              ? "calendar-upcoming__line--red"
              : event.kind === "review"
                ? "calendar-upcoming__line--purple"
                : "calendar-upcoming__line--blue",
        })),
        ...workspace.tasks.map((task) => ({
          id: task.id,
          title: task.title,
          dateKey: task.dueDate,
          type: "task",
          accent: "calendar-upcoming__line--blue",
        })),
      ]
        .filter((item) => item.dateKey)
        .sort((first, second) => first.dateKey.localeCompare(second.dateKey))
        .slice(0, 6),
    [workspace.events, workspace.tasks]
  );

  function handleCreateEvent(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    workspace.addEvent({
      title: eventTitle,
      dateKey: selectedDate,
      dateLabel: formatShortDate(selectedDate),
      kind,
    });
    setEventTitle("");
    setKind("focus");
  }

  function handleCreateTask(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    workspace.addTask({
      title: taskTitle,
      dueDate: selectedDate,
      projectId,
      owner,
      priority,
    });
    setTaskTitle("");
    setProjectId("");
    setOwner("");
    setPriority("medium");
  }

  return (
    <section className="page page--calendar-reference">
      <div className="calendar-reference">
        <section className="calendar-board">
          <header className="calendar-board__header">
            <div>
              <p className="eyebrow">Mes</p>
              <h3>
                {monthLabels[currentDate.getMonth()]} de {currentDate.getFullYear()}
              </h3>
            </div>
            <div className="calendar-board__actions">
              <button
                type="button"
                className="ghost-button ghost-button--reference"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1))}
              >
                Anterior
              </button>
              <button
                type="button"
                className="ghost-button ghost-button--reference"
                onClick={() => {
                  const today = new Date();
                  setCurrentDate(new Date(today.getFullYear(), today.getMonth(), 1));
                  setSelectedDate(today.toISOString().slice(0, 10));
                }}
              >
                Hoje
              </button>
              <button
                type="button"
                className="ghost-button ghost-button--reference"
                onClick={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1))}
              >
                Proximo
              </button>
            </div>
          </header>

          <div className="calendar-board__grid">
            {weekdayLabels.map((label) => (
              <div key={label} className="calendar-board__weekday">
                {label}
              </div>
            ))}

            {monthGrid.map((day, index) =>
              day ? (
                <button
                  key={day.key}
                  type="button"
                  className={`calendar-day-card${selectedDate === day.key ? " calendar-day-card--selected" : ""}${day.isToday ? " calendar-day-card--today" : ""}`}
                  onClick={() => setSelectedDate(day.key)}
                >
                  <span className="calendar-day-card__number">{day.dayNumber}</span>
                  <div className="calendar-day-card__items">
                    {(eventsByDate[day.key] ?? []).slice(0, 2).map((eventItem) => (
                      <span key={eventItem.id} className={`calendar-event-chip calendar-event-chip--${eventItem.kind}`}>
                        {eventItem.title}
                      </span>
                    ))}
                    {(tasksByDate[day.key] ?? []).slice(0, 1).map((task) => (
                      <span key={task.id} className="calendar-event-chip calendar-event-chip--task">
                        {task.title}
                      </span>
                    ))}
                    {(eventsByDate[day.key] ?? []).length + (tasksByDate[day.key] ?? []).length > 3 ? (
                      <span className="calendar-more-chip">
                        +
                        {(eventsByDate[day.key] ?? []).length +
                          (tasksByDate[day.key] ?? []).length -
                          3}
                      </span>
                    ) : null}
                  </div>
                </button>
              ) : (
                <div key={`empty-${index}`} className="calendar-day-card calendar-day-card--empty" />
              )
            )}
          </div>
        </section>

        <aside className="calendar-insights">
          <div className="calendar-insights__empty">
            <div className="calendar-brain-icon" aria-hidden="true">
              <span />
            </div>
            <p>Selecione um dia para ver a agenda</p>
          </div>

          <div className="calendar-composer">
            <p className="eyebrow">Dia selecionado</p>
            <h3>{formatShortDate(selectedDate)}</h3>

            <form className="calendar-composer__form" onSubmit={handleCreateEvent}>
              <input
                value={eventTitle}
                onChange={(nextEvent) => setEventTitle(nextEvent.target.value)}
                placeholder="Novo evento"
                required
              />
              <select value={kind} onChange={(nextEvent) => setKind(nextEvent.target.value as WorkspaceEvent["kind"])}>
                <option value="focus">Foco</option>
                <option value="review">Reuniao</option>
                <option value="delivery">Entrega</option>
              </select>
              <button type="submit" className="primary-button primary-button--reference">
                Criar evento
              </button>
            </form>

            <form className="calendar-composer__form" onSubmit={handleCreateTask}>
              <input
                value={taskTitle}
                onChange={(nextEvent) => setTaskTitle(nextEvent.target.value)}
                placeholder="Nova tarefa do dia"
                required
              />
              <input
                value={owner}
                onChange={(nextEvent) => setOwner(nextEvent.target.value)}
                placeholder="Responsavel"
                required
              />
              <select value={priority} onChange={(nextEvent) => setPriority(nextEvent.target.value as typeof priority)}>
                <option value="high">Alta prioridade</option>
                <option value="medium">Media prioridade</option>
                <option value="low">Baixa prioridade</option>
              </select>
              <select value={projectId} onChange={(nextEvent) => setProjectId(nextEvent.target.value)} required>
                <option value="">Selecione um projeto</option>
                {workspace.projects.map((project) => (
                  <option key={project.id} value={project.id}>
                    {project.name}
                  </option>
                ))}
              </select>
              <button
                type="submit"
                className="primary-button primary-button--reference"
                disabled={workspace.projects.length === 0}
              >
                Criar tarefa
              </button>
            </form>
            {workspace.projects.length === 0 ? (
              <p className="inline-message">
                Crie um projeto antes de cadastrar tarefas no planejamento.
              </p>
            ) : null}

            <div className="calendar-day-summary">
              {selectedEvents.map((eventItem) => (
                <div key={eventItem.id} className="calendar-day-summary__item">
                  <strong>{eventItem.title}</strong>
                  <span>{eventItem.kind}</span>
                </div>
              ))}
              {selectedTasks.map((task) => (
                <div key={task.id} className="calendar-day-summary__item">
                  <strong>{task.title}</strong>
                  <span>{task.owner}</span>
                </div>
              ))}
              {selectedEvents.length === 0 && selectedTasks.length === 0 ? (
                <div className="calendar-day-summary__item calendar-day-summary__item--empty">
                  <strong>Sem itens</strong>
                  <span>Crie o primeiro evento do dia</span>
                </div>
              ) : null}
            </div>
          </div>

          <div className="calendar-upcoming">
            <h3>Proximos Eventos</h3>
            <div className="calendar-upcoming__list">
              {upcomingItems.map((item) => (
                <article key={item.id} className="calendar-upcoming__item">
                  <div className={`calendar-upcoming__line ${item.accent}`} />
                  <div>
                    <strong>{item.title}</strong>
                    <p>{formatShortDate(item.dateKey)}</p>
                  </div>
                </article>
              ))}
              {upcomingItems.length === 0 ? (
                <article className="calendar-upcoming__item calendar-upcoming__item--empty">
                  <div>
                    <strong>Sem agenda</strong>
                    <p>Crie tarefas ou eventos</p>
                  </div>
                </article>
              ) : null}
            </div>
          </div>
        </aside>
      </div>

      <section className="create-card planning-board">
        <div className="create-card__header">
          <div>
            <p className="eyebrow">Planejamento</p>
            <h3>Tarefas e calendario no mesmo lugar</h3>
          </div>
        </div>

        <div className="board-grid">
          {[
            { label: "A fazer", items: groupedTasks.todo, status: "todo" as TaskStatus },
            {
              label: "Em progresso",
              items: groupedTasks.inProgress,
              status: "in_progress" as TaskStatus,
            },
            { label: "Bloqueadas", items: groupedTasks.blocked, status: "blocked" as TaskStatus },
            { label: "Concluidas", items: groupedTasks.done, status: "done" as TaskStatus },
          ].map((column) => (
            <article key={column.label} className="board-column">
              <div className="board-column__header">
                <h3>{column.label}</h3>
                <span>{column.items.length}</span>
              </div>
              {column.items.length > 0 ? (
                column.items.map((task) => (
                  <div key={task.id} className="board-card">
                    <div className="row-spread">
                      <strong>{task.title}</strong>
                      <span className={`tag tag--${task.priority}`}>{task.priority}</span>
                    </div>
                    <p className="row-copy">{getProjectName(workspace.projects, task.projectId)}</p>
                    <div className="meta-row">
                      <span className="tag tag--muted">{task.owner}</span>
                      <span className="tag tag--muted">{task.dueDate}</span>
                    </div>
                    <select
                      className="inline-select"
                      value={task.status}
                      onChange={(nextEvent) =>
                        workspace.updateTaskStatus(task.id, nextEvent.target.value as TaskStatus)
                      }
                    >
                      {statusOptions.map((option) => (
                        <option key={option} value={option}>
                          {getTaskStatusLabel(option)}
                        </option>
                      ))}
                    </select>
                  </div>
                ))
              ) : (
                <div className="board-card board-card--empty">
                  <p className="row-copy">Sem tarefas aqui.</p>
                </div>
              )}
            </article>
          ))}
        </div>
      </section>
    </section>
  );
}

export default Calendar;
