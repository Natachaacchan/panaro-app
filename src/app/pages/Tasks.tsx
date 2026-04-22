import { useState } from "react";
import type { FormEvent } from "react";
import {
  getProjectName,
  getTaskStatusLabel,
  groupTasksByStatus,
  useWorkspaceData,
} from "../hooks/useWorkspaceData";
import type { TaskStatus } from "../types/workspace";

const statusOptions: TaskStatus[] = ["todo", "in_progress", "blocked", "done"];

export function Tasks() {
  const workspace = useWorkspaceData();
  const grouped = groupTasksByStatus(workspace.tasks);
  const [title, setTitle] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [projectId, setProjectId] = useState("");
  const [owner, setOwner] = useState("");
  const [priority, setPriority] = useState<"high" | "medium" | "low">("medium");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    workspace.addTask({
      title,
      dueDate,
      projectId,
      owner,
      priority,
    });
    setTitle("");
    setDueDate("");
    setProjectId("");
    setOwner("");
    setPriority("medium");
  }

  return (
    <section className="page">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Tarefas</p>
          <h1>Organize e acompanhe.</h1>
          <p className="page-copy">Tudo salvo na conta.</p>
        </div>
      </div>

      <section className="create-card">
        <div className="create-card__header">
          <div>
            <p className="eyebrow">Nova tarefa</p>
            <h3>Adicionar item ao pipeline</h3>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titulo da tarefa"
            required
          />
          <input
            value={owner}
            onChange={(event) => setOwner(event.target.value)}
            placeholder="Responsavel"
            required
          />
          <input
            type="date"
            value={dueDate}
            onChange={(event) => setDueDate(event.target.value)}
            required
          />
          <select value={priority} onChange={(event) => setPriority(event.target.value as typeof priority)}>
            <option value="high">Alta prioridade</option>
            <option value="medium">Media prioridade</option>
            <option value="low">Baixa prioridade</option>
          </select>
          <select value={projectId} onChange={(event) => setProjectId(event.target.value)} required>
            <option value="">Selecione um projeto</option>
            {workspace.projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
          <button className="primary-button" type="submit" disabled={workspace.projects.length === 0}>
            Criar tarefa
          </button>
        </form>
        {workspace.projects.length === 0 ? (
          <p className="inline-message">Crie um projeto antes de cadastrar tarefas.</p>
        ) : null}
      </section>

      <div className="board-grid">
        {[
          { label: "A fazer", items: grouped.todo, status: "todo" as TaskStatus },
          { label: "Em progresso", items: grouped.inProgress, status: "in_progress" as TaskStatus },
          { label: "Bloqueadas", items: grouped.blocked, status: "blocked" as TaskStatus },
          { label: "Concluidas", items: grouped.done, status: "done" as TaskStatus },
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
                    onChange={(event) =>
                      workspace.updateTaskStatus(task.id, event.target.value as TaskStatus)
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
  );
}

export default Tasks;
