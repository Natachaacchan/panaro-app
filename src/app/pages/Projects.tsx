import { useState } from "react";
import type { FormEvent } from "react";
import { getProjectStatusLabel, useWorkspaceData } from "../hooks/useWorkspaceData";
import type { ProjectStatus } from "../types/workspace";

const projectStatusOptions: ProjectStatus[] = ["planning", "active", "at_risk", "done"];

function getProjectAccent(progress: number) {
  if (progress >= 80) return "project-visual--emerald";
  if (progress >= 45) return "project-visual--blue";
  return "project-visual--violet";
}

export function Projects() {
  const workspace = useWorkspaceData();
  const [name, setName] = useState("");
  const [lead, setLead] = useState("");
  const [nextMilestone, setNextMilestone] = useState("");
  const [summary, setSummary] = useState("");

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    workspace.addProject({
      name,
      lead,
      nextMilestone,
      summary,
    });
    setName("");
    setLead("");
    setNextMilestone("");
    setSummary("");
  }

  return (
    <section className="page">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Projetos</p>
          <h1>Portifolio vivo dos projetos.</h1>
          <p className="page-copy">Acompanhe status, marco e progresso com leitura rapida.</p>
        </div>
      </div>

      <section className="create-card">
        <div className="create-card__header">
          <div>
            <p className="eyebrow">Novo projeto</p>
            <h3>Cadastrar frente de trabalho</h3>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Nome do projeto"
            required
          />
          <input
            value={lead}
            onChange={(event) => setLead(event.target.value)}
            placeholder="Pessoa lider"
            required
          />
          <input
            value={nextMilestone}
            onChange={(event) => setNextMilestone(event.target.value)}
            placeholder="Proximo marco"
            required
          />
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Resumo curto"
            required
          />
          <button className="primary-button" type="submit">
            Criar projeto
          </button>
        </form>
      </section>

      <div className="project-grid">
        {workspace.projects.length > 0 ? (
          workspace.projects.map((project) => (
            <article key={project.id} className="project-card">
              <div className="project-card__glow" aria-hidden="true" />
              <div className={`project-visual ${getProjectAccent(project.progress)}`}>
                <div className="project-visual__badge">{project.name.slice(0, 2).toUpperCase()}</div>
                <div className="project-visual__grid" aria-hidden="true">
                  <span />
                  <span />
                  <span />
                </div>
                <div className="project-visual__progress">
                  <small>Entrega visual</small>
                  <strong>{project.progress}%</strong>
                </div>
              </div>

              <div className="row-spread">
                <div>
                  <p className="eyebrow">Projeto</p>
                  <h3>{project.name}</h3>
                </div>
                <span className="tag tag--muted">{getProjectStatusLabel(project.status)}</span>
              </div>

              <p className="page-copy">{project.summary}</p>

              <div className="meta-row">
                <span className="tag tag--muted">Lead: {project.lead}</span>
                <span className="tag tag--muted">Marco: {project.nextMilestone}</span>
              </div>

              <div className="project-card__controls">
                <select
                  className="inline-select"
                  value={project.status}
                  onChange={(event) =>
                    workspace.updateProject(project.id, {
                      status: event.target.value as ProjectStatus,
                    })
                  }
                >
                  {projectStatusOptions.map((option) => (
                    <option key={option} value={option}>
                      {getProjectStatusLabel(option)}
                    </option>
                  ))}
                </select>

                <input
                  className="project-progress-slider"
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={project.progress}
                  onChange={(event) =>
                    workspace.updateProject(project.id, {
                      progress: Number(event.target.value),
                    })
                  }
                  aria-label={`Atualizar progresso de ${project.name}`}
                />
              </div>

              <div className="progress-block">
                <small>Progresso</small>
                <div className="progress-track">
                  <div className="progress-fill" style={{ width: `${project.progress}%` }} />
                </div>
              </div>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>Sem projetos.</h3>
            <p className="page-copy">Crie o primeiro.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Projects;
