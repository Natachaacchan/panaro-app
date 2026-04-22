import { createEmptyWorkspace } from "../data/mockWorkspace";
import { isSupabaseConfigured, supabase } from "./supabaseClient";
import type { WorkspaceData } from "../types/workspace";

const STORAGE_PREFIX = "panora.workspace";
const LEGACY_STORAGE_PREFIX = "panaro.workspace";

export type WorkspacePersistenceMode = "local" | "supabase";

type WorkspaceLoadResult = {
  mode: WorkspacePersistenceMode;
  workspace: WorkspaceData;
};

function normalizeWorkspace(input: Partial<WorkspaceData> | null | undefined): WorkspaceData {
  const base = createEmptyWorkspace();

  return {
    ...base,
    ...input,
    tasks: Array.isArray(input?.tasks) ? input.tasks : base.tasks,
    projects: Array.isArray(input?.projects) ? input.projects : base.projects,
    notes: Array.isArray(input?.notes) ? input.notes : base.notes,
    events: Array.isArray(input?.events)
      ? input.events.map((event) => ({
          ...event,
          dateKey:
            typeof event.dateKey === "string" && event.dateKey.length > 0
              ? event.dateKey
              : typeof event.dateLabel === "string" && /^\d{4}-\d{2}-\d{2}$/.test(event.dateLabel)
                ? event.dateLabel
                : "",
        }))
      : base.events,
    diagramItems: Array.isArray(input?.diagramItems) ? input.diagramItems : base.diagramItems,
  };
}

function getStorageKey(userId: string) {
  return `${STORAGE_PREFIX}:${userId}`;
}

function getLegacyStorageKey(userId: string) {
  return `${LEGACY_STORAGE_PREFIX}:${userId}`;
}

function readLocalWorkspace(userId: string) {
  const currentKey = getStorageKey(userId);
  const legacyKey = getLegacyStorageKey(userId);
  const savedWorkspace =
    window.localStorage.getItem(currentKey) ?? window.localStorage.getItem(legacyKey);

  if (!savedWorkspace) {
    const emptyWorkspace = createEmptyWorkspace();
    window.localStorage.setItem(currentKey, JSON.stringify(emptyWorkspace));
    return emptyWorkspace;
  }

  try {
    const parsed = normalizeWorkspace(JSON.parse(savedWorkspace) as WorkspaceData);
    window.localStorage.setItem(currentKey, JSON.stringify(parsed));
    window.localStorage.removeItem(legacyKey);
    return parsed;
  } catch {
    const emptyWorkspace = createEmptyWorkspace();
    window.localStorage.setItem(currentKey, JSON.stringify(emptyWorkspace));
    return emptyWorkspace;
  }
}

function writeLocalWorkspace(userId: string, workspace: WorkspaceData) {
  window.localStorage.setItem(getStorageKey(userId), JSON.stringify(normalizeWorkspace(workspace)));
  window.localStorage.removeItem(getLegacyStorageKey(userId));
}

export async function loadWorkspace(userId: string): Promise<WorkspaceLoadResult> {
  if (!isSupabaseConfigured || !supabase) {
    return {
      mode: "local",
      workspace: readLocalWorkspace(userId),
    };
  }

  try {
    const { data, error } = await supabase
      .from("workspaces")
      .select("payload")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      throw error;
    }

    const payload = data?.payload;
    const workspace = payload ? normalizeWorkspace(payload as WorkspaceData) : createEmptyWorkspace();

    writeLocalWorkspace(userId, workspace);

    return {
      mode: "supabase",
      workspace,
    };
  } catch (error) {
    console.warn("Falha ao carregar workspace do Supabase. Usando armazenamento local.", error);
    return {
      mode: "local",
      workspace: readLocalWorkspace(userId),
    };
  }
}

export async function saveWorkspace(
  userId: string,
  workspace: WorkspaceData,
  mode: WorkspacePersistenceMode
) {
  const normalizedWorkspace = normalizeWorkspace(workspace);
  writeLocalWorkspace(userId, normalizedWorkspace);

  if (mode !== "supabase" || !isSupabaseConfigured || !supabase) {
    return;
  }

  const { error } = await supabase.from("workspaces").upsert(
    {
      user_id: userId,
      payload: normalizedWorkspace,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) {
    throw error;
  }
}
