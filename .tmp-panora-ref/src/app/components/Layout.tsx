import { Outlet, NavLink } from "react-router";
import {
  LayoutDashboard,
  CheckSquare,
  FolderKanban,
  Calendar as CalendarIcon,
  FileText,
  Plus,
  Search,
  Bell,
  Settings,
  ChevronDown,
  Sparkles,
  Network,
  Menu,
  ChevronsLeft,
  ChevronsRight
} from "lucide-react";
import { motion } from "motion/react";
import { useState, useEffect } from "react";

const navItems = [
  { path: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { path: "/dashboard/tasks", label: "Tarefas", icon: CheckSquare },
  { path: "/dashboard/projects", label: "Projetos", icon: FolderKanban },
  { path: "/dashboard/calendar", label: "Calendário", icon: CalendarIcon },
  { path: "/dashboard/notes", label: "Notas", icon: FileText },
  { path: "/dashboard/visual-editor", label: "Editor Visual", icon: Network },
];

// Componente de estrelas do fundo
const Starfield = () => {
  const stars = Array.from({ length: 100 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 2,
    delay: Math.random() * 3,
  }));

  return (
    <div className="fixed inset-0 overflow-hidden pointer-events-none">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute rounded-full bg-purple-300"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
          }}
          animate={{
            opacity: [0.2, 1, 0.2],
            scale: [1, 1.5, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            delay: star.delay,
          }}
        />
      ))}
    </div>
  );
};

export function Layout() {
  const [sidebarExpanded, setSidebarExpanded] = useState(true);

  return (
    <div className="flex h-screen bg-[#0a0a0f] relative overflow-hidden">
      {/* Subtle gradient background */}
      <div className="fixed inset-0 bg-gradient-to-br from-purple-500/5 via-transparent to-pink-500/5 pointer-events-none" />

      {/* Sidebar */}
      <motion.aside
        initial={{ width: 280 }}
        animate={{ width: sidebarExpanded ? 280 : 80 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className="relative z-10 bg-[#12121a]/95 backdrop-blur-sm border-r border-white/5 flex flex-col"
      >
        {/* Logo */}
        <div className="p-6 border-b border-white/5">
          <div className="flex items-center justify-between mb-2">
            <motion.div
              className="flex items-center gap-3 flex-1"
              whileHover={{ scale: 1.01 }}
            >
              {/* Logo simples e moderno */}
              <div className="relative w-10 h-10">
                <div className="w-full h-full rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <div className="text-white font-bold text-lg">P</div>
                </div>
              </div>
              {sidebarExpanded && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <h1 className="font-bold text-xl text-white">
                    Panora
                  </h1>
                  <p className="text-xs text-gray-400">Organize sua rotina</p>
                </motion.div>
              )}
            </motion.div>
          </div>

          {/* Toggle Button */}
          <motion.button
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setSidebarExpanded(!sidebarExpanded)}
            className="w-full mt-3 p-2 rounded-lg bg-white/[0.02] border border-white/5 hover:border-white/10 transition-all flex items-center justify-center gap-2 text-gray-400"
          >
            {sidebarExpanded ? (
              <>
                <ChevronsLeft className="w-4 h-4" />
                <span className="text-sm">Recolher</span>
              </>
            ) : (
              <ChevronsRight className="w-4 h-4" />
            )}
          </motion.button>
        </div>

        {/* Quick Action */}
        <div className="px-4 py-4">
          <motion.button
            whileHover={{ scale: 1.01, backgroundColor: "rgba(139, 92, 246, 1)" }}
            whileTap={{ scale: 0.99 }}
            className={`w-full bg-purple-500 hover:bg-purple-600 text-white rounded-lg py-2.5 flex items-center justify-center gap-2 font-medium transition-all ${
              sidebarExpanded ? "px-4" : "px-3"
            }`}
          >
            <Plus className="w-4 h-4" />
            {sidebarExpanded && (
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="text-sm"
              >
                Nova Tarefa
              </motion.span>
            )}
          </motion.button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === "/dashboard"}
              title={!sidebarExpanded ? item.label : undefined}
              className={({ isActive }) =>
                `flex items-center gap-3 py-2.5 rounded-lg mb-1 transition-all group relative ${
                  sidebarExpanded ? "px-3" : "px-3 justify-center"
                } ${
                  isActive
                    ? "bg-purple-500/10 text-white"
                    : "text-gray-400 hover:bg-white/5 hover:text-white"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  {isActive && (
                    <motion.div
                      layoutId="activeNav"
                      className="absolute inset-0 bg-purple-500/10 rounded-lg"
                      transition={{ type: "spring", bounce: 0.15, duration: 0.5 }}
                    />
                  )}
                  <item.icon className={`w-5 h-5 relative z-10 ${isActive ? "text-purple-400" : ""}`} />
                  {sidebarExpanded && (
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.2 }}
                      className="text-sm font-medium relative z-10"
                    >
                      {item.label}
                    </motion.span>
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-white/5">
          <motion.div
            whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.03)" }}
            title={!sidebarExpanded ? "Usuário" : undefined}
            className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-colors ${
              !sidebarExpanded ? "justify-center" : ""
            }`}
          >
            <div className="w-9 h-9 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-semibold flex-shrink-0">
              U
            </div>
            {sidebarExpanded && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex-1"
                >
                  <p className="font-medium text-sm text-white">Usuário</p>
                  <p className="text-xs text-gray-500">usuario@email.com</p>
                </motion.div>
                <ChevronDown className="w-4 h-4 text-gray-500" />
              </>
            )}
          </motion.div>
        </div>
      </motion.aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden relative z-10">
        {/* Top Bar */}
        <header className="bg-[#12121a]/80 backdrop-blur-sm border-b border-white/5 px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3 flex-1 max-w-2xl">
            {/* Menu Toggle Button */}
            <motion.button
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSidebarExpanded(!sidebarExpanded)}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Menu className="w-5 h-5 text-gray-400" />
            </motion.button>

            {/* Search */}
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                placeholder="Pesquisar tarefas, projetos, notas..."
                className="w-full bg-white/[0.03] border border-white/5 rounded-lg pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all text-white placeholder-gray-500"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 ml-6">
            <motion.button
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="relative p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Bell className="w-5 h-5 text-gray-400" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
            </motion.button>
            <motion.button
              whileHover={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
              whileTap={{ scale: 0.95 }}
              className="p-2 rounded-lg hover:bg-white/5 transition-colors"
            >
              <Settings className="w-5 h-5 text-gray-400" />
            </motion.button>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}