import type { WorkspaceData } from "../types/workspace";

export function createEmptyWorkspace(): WorkspaceData {
  return {
    tasks: [],
    projects: [],
    notes: [],
    events: [],
    diagramItems: [],
  };
}
