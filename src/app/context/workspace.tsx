/* eslint-disable react-refresh/only-export-components, react-hooks/set-state-in-effect */
import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { createEmptyWorkspace } from "../data/mockWorkspace";
import type {
  DiagramItem,
  DiagramItemType,
  NewDiagramItemInput,
  NewEventInput,
  NewNoteInput,
  NewProjectInput,
  NewTaskInput,
  Note,
  Project,
  ProjectStatus,
  Task,
  TaskStatus,
  WorkspaceData,
  WorkspaceEvent,
} from "../types/workspace";
import {
  loadWorkspace,
  saveWorkspace,
  type WorkspacePersistenceMode,
} from "../services/workspaceStore";
import { useAuth } from "./auth";

type WorkspaceMetrics = {
  totalTasks: number;
  activeProjects: number;
  weeklyDeliveries: number;
  blockedTasks: number;
};

type WorkspaceContextType = WorkspaceData & {
  metrics: WorkspaceMetrics;
  hydrated: boolean;
  persistenceMode: WorkspacePersistenceMode;
  addTask: (input: NewTaskInput) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus) => void;
  addProject: (input: NewProjectInput) => void;
  updateProject: (
    projectId: string,
    patch: Partial<Pick<Project, "status" | "progress" | "nextMilestone" | "summary" | "lead">>
  ) => void;
  addNote: (input: NewNoteInput) => void;
  addEvent: (input: NewEventInput) => void;
  addDiagramItem: (input: NewDiagramItemInput) => string;
  updateDiagramItem: (itemId: string, patch: Partial<Pick<DiagramItem, "x" | "y" | "label">>) => void;
  removeDiagramItem: (itemId: string) => void;
  clearDiagram: () => void;
};

const WorkspaceContext = createContext<WorkspaceContextType | undefined>(undefined);

function getTodayLabel() {
  return new Intl.DateTimeFormat("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  }).format(new Date());
}

function getDefaultDiagramLabel(type: DiagramItemType) {
  const labels: Record<DiagramItemType, string> = {
    rectangle: "Bloco",
    circle: "Inicio",
    diamond: "Decisao",
    connector: "Conector",
    arrow: "Fluxo",
  };

  return labels[type];
}

export function WorkspaceProvider({ children }: { children: React.ReactNode }) {
  const { user } = useAuth();
  const [workspace, setWorkspace] = useState<WorkspaceData>(createEmptyWorkspace);
  const [hydrated, setHydrated] = useState(false);
  const [persistenceMode, setPersistenceMode] = useState<WorkspacePersistenceMode>("local");

  useEffect(() => {
    let active = true;

    if (!user) {
      setWorkspace(createEmptyWorkspace());
      setPersistenceMode("local");
      setHydrated(true);
      return;
    }

    const userId = user.id;
    setHydrated(false);

    async function hydrateWorkspace() {
      const result = await loadWorkspace(userId);

      if (!active) {
        return;
      }

      setWorkspace(result.workspace);
      setPersistenceMode(result.mode);
      setHydrated(true);
    }

    void hydrateWorkspace();

    return () => {
      active = false;
    };
  }, [user]);

  useEffect(() => {
    if (!user || !hydrated) {
      return;
    }

    void saveWorkspace(user.id, workspace, persistenceMode).catch((error) => {
      console.error("Erro ao salvar workspace:", error);
    });
  }, [hydrated, persistenceMode, user, workspace]);

  const metrics = useMemo<WorkspaceMetrics>(() => {
    const weeklyDeliveries = workspace.events.filter((event) => event.kind === "delivery").length;

    return {
      totalTasks: workspace.tasks.filter((task) => task.status !== "done").length,
      activeProjects: workspace.projects.filter((project) => project.status === "active").length,
      weeklyDeliveries,
      blockedTasks: workspace.tasks.filter((task) => task.status === "blocked").length,
    };
  }, [workspace]);

  const value = useMemo<WorkspaceContextType>(
    () => ({
      ...workspace,
      metrics,
      hydrated,
      persistenceMode,
      addTask: (input) => {
        setWorkspace((current) => ({
          ...current,
          tasks: [
            {
              id: crypto.randomUUID(),
              status: "todo",
              ...input,
            },
            ...current.tasks,
          ],
        }));
      },
      updateTaskStatus: (taskId, status) => {
        setWorkspace((current) => ({
          ...current,
          tasks: current.tasks.map((task) =>
            task.id === taskId ? { ...task, status } : task
          ),
        }));
      },
      addProject: (input) => {
        setWorkspace((current) => ({
          ...current,
          projects: [
            {
              id: crypto.randomUUID(),
              status: "planning",
              progress: 0,
              ...input,
            },
            ...current.projects,
          ],
        }));
      },
      updateProject: (projectId, patch) => {
        setWorkspace((current) => ({
          ...current,
          projects: current.projects.map((project) =>
            project.id === projectId ? { ...project, ...patch } : project
          ),
        }));
      },
      addNote: (input) => {
        setWorkspace((current) => ({
          ...current,
          notes: [
            {
              id: crypto.randomUUID(),
              updatedAt: getTodayLabel(),
              ...input,
            },
            ...current.notes,
          ],
        }));
      },
      addEvent: (input) => {
        setWorkspace((current) => ({
          ...current,
          events: [
            {
              id: crypto.randomUUID(),
              ...input,
            },
            ...current.events,
          ],
        }));
      },
      addDiagramItem: (input) => {
        const nextId = crypto.randomUUID();

        setWorkspace((current) => {
          const currentDiagramItems = current.diagramItems ?? [];
          const index = currentDiagramItems.length;

          return {
            ...current,
            diagramItems: [
              ...currentDiagramItems,
              {
                id: nextId,
                type: input.type,
                label: input.label?.trim() || getDefaultDiagramLabel(input.type),
                x: 80 + (index % 4) * 160,
                y: 72 + Math.floor(index / 4) * 140,
              },
            ],
          };
        });

        return nextId;
      },
      updateDiagramItem: (itemId, patch) => {
        setWorkspace((current) => ({
          ...current,
          diagramItems: (current.diagramItems ?? []).map((item) =>
            item.id === itemId ? { ...item, ...patch } : item
          ),
        }));
      },
      removeDiagramItem: (itemId) => {
        setWorkspace((current) => ({
          ...current,
          diagramItems: (current.diagramItems ?? []).filter((item) => item.id !== itemId),
        }));
      },
      clearDiagram: () => {
        setWorkspace((current) => ({
          ...current,
          diagramItems: [],
        }));
      },
    }),
    [hydrated, metrics, persistenceMode, workspace]
  );

  return <WorkspaceContext.Provider value={value}>{children}</WorkspaceContext.Provider>;
}

export function useWorkspaceData() {
  const context = useContext(WorkspaceContext);

  if (!context) {
    throw new Error("useWorkspaceData precisa estar dentro de WorkspaceProvider");
  }

  return context;
}

export function getTaskStatusLabel(status: TaskStatus) {
  const labels: Record<TaskStatus, string> = {
    todo: "A fazer",
    in_progress: "Em progresso",
    blocked: "Bloqueada",
    done: "Concluída",
  };

  return labels[status];
}

export function getProjectStatusLabel(status: ProjectStatus) {
  const labels: Record<ProjectStatus, string> = {
    planning: "Planejamento",
    active: "Ativo",
    at_risk: "Em risco",
    done: "Concluído",
  };

  return labels[status];
}

export function groupTasksByStatus(tasks: Task[]) {
  return {
    todo: tasks.filter((task) => task.status === "todo"),
    inProgress: tasks.filter((task) => task.status === "in_progress"),
    blocked: tasks.filter((task) => task.status === "blocked"),
    done: tasks.filter((task) => task.status === "done"),
  };
}

export function getProjectName(projects: Project[], projectId: string) {
  return projects.find((project) => project.id === projectId)?.name ?? "Sem projeto";
}

export function getRecentNotes(notes: Note[]) {
  return [...notes].slice(0, 3);
}

export function getUpcomingEvents(events: WorkspaceEvent[]) {
  return [...events].slice(0, 3);
}
