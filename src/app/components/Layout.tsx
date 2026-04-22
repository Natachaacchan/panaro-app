import { useMemo, useState, type ReactNode } from "react";
import { Navigate, NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/auth";
import { useWorkspaceData } from "../hooks/useWorkspaceData";

const navItems = [
  { path: "/", label: "Dashboard", icon: "dashboard", exact: true },
  { path: "/calendar", label: "Planejamento", icon: "tasks" },
  { path: "/projects", label: "Projetos", icon: "projects" },
  { path: "/notes", label: "Notas", icon: "notes" },
  { path: "/visual-editor", label: "Editor Visual", icon: "editor" },
];

function AppIcon({ name }: { name: string }) {
  const icons: Record<string, ReactNode> = {
    dashboard: (
      <path
        d="M4 4h7v7H4zM13 4h7v4h-7zM13 10h7v10h-7zM4 13h7v7H4z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    tasks: (
      <path
        d="M5 7h2l2 2 4-4M13 7h6M5 17h2l2 2 4-4M13 17h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    projects: (
      <path
        d="M4 7h7l2 2h7v9a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zM4 7V6a2 2 0 0 1 2-2h4l2 2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    notes: (
      <path
        d="M7 4h8l4 4v12H7a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2zm8 1v4h4M9 13h6M9 17h6"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    editor: (
      <path
        d="M5 5h4v4H5zM15 5h4v4h-4zM10 10h4v4h-4zM5 15h4v4H5zM15 15h4v4h-4zM9 9l2 2M15 9l-2 2M9 15l2-2M15 15l-2-2"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    plus: (
      <path
        d="M12 5v14M5 12h14"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    ),
    bell: (
      <path
        d="M12 4a4 4 0 0 0-4 4v2.6c0 .6-.2 1.1-.5 1.6L6 15h12l-1.5-2.8a3 3 0 0 1-.5-1.6V8a4 4 0 0 0-4-4zm-2 13a2 2 0 0 0 4 0"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    settings: (
      <path
        d="M12 8.5A3.5 3.5 0 1 0 12 15.5A3.5 3.5 0 1 0 12 8.5zM19 12l1.2-.7-.9-2.1-1.4.2a6.8 6.8 0 0 0-1.2-1.2l.2-1.4-2.1-.9L14 6a6.8 6.8 0 0 0-1.9 0l-.7-1.2-2.1.9.2 1.4a6.8 6.8 0 0 0-1.2 1.2l-1.4-.2-.9 2.1L5 12l1.2.7.2 1.4a6.8 6.8 0 0 0 1.2 1.2l-.2 1.4 2.1.9.7-1.2a6.8 6.8 0 0 0 1.9 0l.7 1.2 2.1-.9-.2-1.4a6.8 6.8 0 0 0 1.2-1.2l1.4.2.9-2.1z"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    chevronRight: (
      <path
        d="M9 6l6 6-6 6"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    search: (
      <path
        d="M11 18a7 7 0 1 1 4.9-2l4.1 4.1"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
  };

  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      {icons[name]}
    </svg>
  );
}

type SearchResult = {
  id: string;
  title: string;
  subtitle: string;
  route: string;
  kind: string;
};

export function Layout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const location = useLocation();
  const navigate = useNavigate();
  const { user, loading, signOut } = useAuth();
  const workspace = useWorkspaceData();

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return [] as SearchResult[];
    }

    const results: SearchResult[] = [
      ...workspace.tasks.map((task) => ({
        id: `task-${task.id}`,
        title: task.title,
        subtitle: `Tarefa • ${task.owner} • ${task.dueDate}`,
        route: "/calendar",
        kind: "Tarefa",
      })),
      ...workspace.projects.map((project) => ({
        id: `project-${project.id}`,
        title: project.name,
        subtitle: `Projeto • ${project.lead} • ${project.nextMilestone}`,
        route: "/projects",
        kind: "Projeto",
      })),
      ...workspace.notes.map((note) => ({
        id: `note-${note.id}`,
        title: note.title,
        subtitle: `Nota • ${note.category} • ${note.updatedAt}`,
        route: "/notes",
        kind: "Nota",
      })),
      ...workspace.events.map((event) => ({
        id: `event-${event.id}`,
        title: event.title,
        subtitle: `Evento • ${event.dateLabel} • ${event.kind}`,
        route: "/calendar",
        kind: "Evento",
      })),
    ];

    return results
      .filter(
        (item) =>
          item.title.toLowerCase().includes(query) || item.subtitle.toLowerCase().includes(query)
      )
      .slice(0, 8);
  }, [searchQuery, workspace.events, workspace.notes, workspace.projects, workspace.tasks]);

  if (loading || !workspace.hydrated) {
    return (
      <div className="app-shell app-shell--loading">
        <div className="content-panel">
          <p className="eyebrow">Panora</p>
          <h2>Carregando workspace</h2>
          <p className="page-copy">Carregando seus dados.</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const currentLabel =
    navItems.find((item) => item.path === location.pathname)?.label ??
    (location.pathname === "/tasks" ? "Planejamento" : "Workspace");
  const isDashboardRoute = location.pathname === "/";

  function handleSelectSearchResult(route: string) {
    setSearchQuery("");
    void navigate(route);
  }

  return (
    <div className="workspace-scene workspace-scene--reference">
      <div className="workspace-stars" aria-hidden="true" />
      <div className="workspace-glow workspace-glow--top" aria-hidden="true" />
      <div className="workspace-glow workspace-glow--side" aria-hidden="true" />

      <div
        className={`app-shell app-shell--reference${
          sidebarCollapsed ? " app-shell--collapsed app-shell--reference-collapsed" : ""
        }`}
      >
        <aside
          className={`sidebar sidebar--reference${
            sidebarCollapsed ? " sidebar--collapsed sidebar--reference-collapsed" : ""
          }`}
        >
          <div className="sidebar-section sidebar-section--header">
            <button
              type="button"
              className="brand-row brand-row--interactive"
              onClick={() => setSidebarCollapsed((current) => !current)}
              aria-label={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
              title={sidebarCollapsed ? "Expandir menu" : "Recolher menu"}
            >
              <div className="brand-mark" aria-hidden="true">
                <span>P</span>
              </div>
              <div className="brand-copy">
                <h1 className="brand brand--reference">Panora</h1>
                <p className="sidebar-copy">Gestao 360° da sua rotina</p>
              </div>
            </button>
          </div>

          <div className="sidebar-section">
            <button
              type="button"
              className={`primary-action-button${
                sidebarCollapsed ? " primary-action-button--compact" : ""
              }`}
              aria-label="Criar nova tarefa"
            >
              <AppIcon name="plus" />
              <span>Novo Item</span>
            </button>
          </div>

          <nav className="nav-list nav-list--reference">
            {navItems.map((item) => (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.exact}
                className={({ isActive }) =>
                  `nav-link nav-link--reference${
                    sidebarCollapsed ? " nav-link--compact" : ""
                  }${isActive ? " nav-link--active" : ""}`
                }
                aria-label={item.label}
                title={sidebarCollapsed ? item.label : undefined}
              >
                <span className="nav-link__badge nav-link__badge--reference">
                  <AppIcon name={item.icon} />
                </span>
                <span className="nav-link__text">{item.label}</span>
              </NavLink>
            ))}
          </nav>

          <div className="sidebar-section sidebar-section--footer">
            <button
              type="button"
              className={`user-card user-card--reference${
                sidebarCollapsed ? " user-card--compact" : ""
              }`}
              onClick={() => void signOut()}
              aria-label="Sair"
              title={sidebarCollapsed ? "Sair" : undefined}
            >
              <span className="user-card__avatar">
                {(user.email?.[0] ?? "U").toUpperCase()}
              </span>
              <span className="user-card__content">
                <strong className="user-card__name">Usuario</strong>
                <span className="user-card__meta">{user.email ?? "usuario@email.com"}</span>
              </span>
              <span className="user-card__chevron">
                <AppIcon name="chevronRight" />
              </span>
            </button>
          </div>
        </aside>

        <section className="workspace-main">
          <header className="workspace-topbar">
            <div className="topbar-search-shell">
              <label className="topbar-search">
                <AppIcon name="search" />
                <input
                  type="search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Pesquisar tarefas, projetos, notas..."
                />
              </label>

              {searchQuery.trim() ? (
                <div className="search-results-panel">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button
                        key={result.id}
                        type="button"
                        className="search-result-item"
                        onClick={() => handleSelectSearchResult(result.route)}
                      >
                        <strong>{result.title}</strong>
                        <span>{result.subtitle}</span>
                      </button>
                    ))
                  ) : (
                    <div className="search-empty-state">
                      <strong>Nada encontrado</strong>
                      <span>Tente outro termo para localizar itens do seu workspace.</span>
                    </div>
                  )}
                </div>
              ) : null}
            </div>

            <div className="topbar-actions">
              <button type="button" className="topbar-icon-button" aria-label="Notificacoes">
                <AppIcon name="bell" />
                <span className="topbar-dot" />
              </button>
              <button type="button" className="topbar-icon-button" aria-label="Configuracoes">
                <AppIcon name="settings" />
              </button>
            </div>
          </header>

          <main className="workspace-page">
            <div className="workspace-page__header">
              <div>
                {!isDashboardRoute ? <p className="eyebrow">Workspace</p> : null}
                {!isDashboardRoute ? <h2>{currentLabel}</h2> : null}
              </div>
              <div className="header-chip header-chip--reference">
                {workspace.tasks.length} itens salvos
              </div>
            </div>
            <Outlet />
          </main>
        </section>
      </div>
    </div>
  );
}
