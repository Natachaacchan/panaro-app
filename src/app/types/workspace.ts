export type TaskStatus = "todo" | "in_progress" | "blocked" | "done";
export type ProjectStatus = "planning" | "active" | "at_risk" | "done";
export type NoteCategory = "product" | "ops" | "research";

export type Task = {
  id: string;
  title: string;
  status: TaskStatus;
  dueDate: string;
  projectId: string;
  priority: "high" | "medium" | "low";
  owner: string;
};

export type Project = {
  id: string;
  name: string;
  status: ProjectStatus;
  progress: number;
  lead: string;
  nextMilestone: string;
  summary: string;
};

export type Note = {
  id: string;
  title: string;
  category: NoteCategory;
  updatedAt: string;
  summary: string;
};

export type WorkspaceEvent = {
  id: string;
  title: string;
  dateKey: string;
  dateLabel: string;
  kind: "delivery" | "review" | "focus";
};

export type DiagramItemType = "rectangle" | "circle" | "diamond" | "connector" | "arrow";

export type DiagramItem = {
  id: string;
  type: DiagramItemType;
  label: string;
  x: number;
  y: number;
};

export type WorkspaceData = {
  tasks: Task[];
  projects: Project[];
  notes: Note[];
  events: WorkspaceEvent[];
  diagramItems: DiagramItem[];
};

export type NewTaskInput = {
  title: string;
  dueDate: string;
  projectId: string;
  priority: Task["priority"];
  owner: string;
};

export type NewProjectInput = {
  name: string;
  lead: string;
  nextMilestone: string;
  summary: string;
};

export type NewNoteInput = {
  title: string;
  category: NoteCategory;
  summary: string;
};

export type NewEventInput = {
  title: string;
  dateKey: string;
  dateLabel: string;
  kind: WorkspaceEvent["kind"];
};

export type NewDiagramItemInput = {
  type: DiagramItemType;
  label?: string;
};
