import { motion } from "motion/react";
import { useState } from "react";
import { 
  Plus, 
  Download, 
  Trash2, 
  Square, 
  Circle, 
  Diamond,
  GitBranch,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Box,
  Database,
  Cloud,
  Server,
  Cpu,
  HardDrive,
  Workflow,
  Network
} from "lucide-react";

type EditorMode = "selection" | "flowchart" | "diagram";

interface Template {
  id: string;
  name: string;
  description: string;
  type: "flowchart" | "diagram";
  preview: string;
  flowNodes?: FlowNode[];
  connections?: Connection[];
  diagramNodes?: DiagramNode[];
}

// Flowchart Types
interface FlowNode {
  id: string;
  type: "start" | "process" | "decision" | "end";
  x: number;
  y: number;
  text: string;
}

interface Connection {
  from: string;
  to: string;
  label?: string;
}

const nodeShapes = {
  start: { icon: Circle, color: "from-emerald-500 to-teal-500", shape: "circle" },
  process: { icon: Square, color: "from-blue-500 to-cyan-500", shape: "rectangle" },
  decision: { icon: Diamond, color: "from-purple-500 to-pink-500", shape: "diamond" },
  end: { icon: Circle, color: "from-red-500 to-orange-500", shape: "circle" },
};

// Diagram Types
interface DiagramNode {
  id: string;
  type: "component" | "database" | "cloud" | "server" | "api" | "storage";
  x: number;
  y: number;
  label: string;
}

const nodeTypes = {
  component: { icon: Box, color: "from-blue-500 to-cyan-500", label: "Componente" },
  database: { icon: Database, color: "from-green-500 to-emerald-500", label: "Banco de Dados" },
  cloud: { icon: Cloud, color: "from-purple-500 to-pink-500", label: "Cloud" },
  server: { icon: Server, color: "from-orange-500 to-red-500", label: "Servidor" },
  api: { icon: Cpu, color: "from-yellow-500 to-orange-500", label: "API" },
  storage: { icon: HardDrive, color: "from-indigo-500 to-purple-500", label: "Storage" },
};

const templates: Template[] = [
  {
    id: "flowchart-login",
    name: "Processo de Login",
    description: "Fluxograma completo de autenticação de usuário",
    type: "flowchart",
    preview: "🔐",
    flowNodes: [
      { id: "1", type: "start", x: 400, y: 50, text: "Início" },
      { id: "2", type: "process", x: 400, y: 150, text: "Inserir Credenciais" },
      { id: "3", type: "decision", x: 400, y: 280, text: "Credenciais Válidas?" },
      { id: "4", type: "process", x: 250, y: 420, text: "Mostrar Erro" },
      { id: "5", type: "process", x: 550, y: 420, text: "Criar Sessão" },
      { id: "6", type: "end", x: 250, y: 550, text: "Fim" },
      { id: "7", type: "end", x: 550, y: 550, text: "Dashboard" },
    ],
    connections: [
      { from: "1", to: "2" },
      { from: "2", to: "3" },
      { from: "3", to: "4", label: "Não" },
      { from: "3", to: "5", label: "Sim" },
      { from: "4", to: "6" },
      { from: "5", to: "7" },
    ],
  },
  {
    id: "flowchart-ecommerce",
    name: "Processo de Compra",
    description: "Fluxo de um pedido em e-commerce",
    type: "flowchart",
    preview: "🛒",
    flowNodes: [
      { id: "1", type: "start", x: 400, y: 50, text: "Início" },
      { id: "2", type: "process", x: 400, y: 150, text: "Adicionar ao Carrinho" },
      { id: "3", type: "decision", x: 400, y: 280, text: "Estoque Disponível?" },
      { id: "4", type: "process", x: 250, y: 420, text: "Mostrar Indisponível" },
      { id: "5", type: "process", x: 550, y: 420, text: "Processar Pagamento" },
      { id: "6", type: "end", x: 250, y: 550, text: "Cancelar" },
      { id: "7", type: "end", x: 550, y: 550, text: "Pedido Confirmado" },
    ],
    connections: [
      { from: "1", to: "2" },
      { from: "2", to: "3" },
      { from: "3", to: "4", label: "Não" },
      { from: "3", to: "5", label: "Sim" },
      { from: "4", to: "6" },
      { from: "5", to: "7" },
    ],
  },
  {
    id: "diagram-microservices",
    name: "Arquitetura Microserviços",
    description: "Sistema distribuído com múltiplos serviços",
    type: "diagram",
    preview: "🏗️",
    diagramNodes: [
      { id: "1", type: "component", x: 150, y: 150, label: "Web App" },
      { id: "2", type: "api", x: 400, y: 150, label: "API Gateway" },
      { id: "3", type: "server", x: 600, y: 100, label: "Auth Service" },
      { id: "4", type: "server", x: 600, y: 200, label: "User Service" },
      { id: "5", type: "server", x: 600, y: 300, label: "Order Service" },
      { id: "6", type: "database", x: 800, y: 200, label: "PostgreSQL" },
      { id: "7", type: "cloud", x: 400, y: 350, label: "AWS S3" },
    ],
  },
  {
    id: "diagram-fullstack",
    name: "Full Stack Application",
    description: "Arquitetura completa frontend e backend",
    type: "diagram",
    preview: "💻",
    diagramNodes: [
      { id: "1", type: "component", x: 150, y: 200, label: "React Frontend" },
      { id: "2", type: "api", x: 400, y: 200, label: "REST API" },
      { id: "3", type: "server", x: 650, y: 200, label: "Node.js Backend" },
      { id: "4", type: "database", x: 650, y: 350, label: "MongoDB" },
      { id: "5", type: "storage", x: 400, y: 350, label: "Redis Cache" },
    ],
  },
];

export function VisualEditor() {
  const [mode, setMode] = useState<EditorMode>("selection");
  
  // Flowchart State
  const [flowNodes, setFlowNodes] = useState<FlowNode[]>([]);
  const [connections, setConnections] = useState<Connection[]>([]);
  const [selectedFlowNode, setSelectedFlowNode] = useState<string | null>(null);
  const [zoom, setZoom] = useState(1);

  // Diagram State
  const [diagramNodes, setDiagramNodes] = useState<DiagramNode[]>([]);
  const [selectedDiagramNode, setSelectedDiagramNode] = useState<string | null>(null);

  // Template Selection
  const loadTemplate = (template: Template) => {
    if (template.type === "flowchart") {
      setFlowNodes(template.flowNodes || []);
      setConnections(template.connections || []);
      setMode("flowchart");
    } else {
      setDiagramNodes(template.diagramNodes || []);
      setMode("diagram");
    }
  };

  const createBlank = (type: "flowchart" | "diagram") => {
    if (type === "flowchart") {
      setFlowNodes([]);
      setConnections([]);
      setMode("flowchart");
    } else {
      setDiagramNodes([]);
      setMode("diagram");
    }
  };

  // Flowchart Functions
  const addFlowNode = (type: "start" | "process" | "decision" | "end") => {
    const newNode: FlowNode = {
      id: Date.now().toString(),
      type,
      x: 400,
      y: 300,
      text: `Novo ${type}`,
    };
    setFlowNodes([...flowNodes, newNode]);
  };

  const deleteFlowNode = (id: string) => {
    setFlowNodes(flowNodes.filter(n => n.id !== id));
    setConnections(connections.filter(c => c.from !== id && c.to !== id));
  };

  const updateFlowNodePosition = (id: string, x: number, y: number) => {
    setFlowNodes(flowNodes.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const updateFlowNodeText = (id: string, text: string) => {
    setFlowNodes(flowNodes.map(n => n.id === id ? { ...n, text } : n));
  };

  // Diagram Functions
  const addDiagramNode = (type: keyof typeof nodeTypes) => {
    const newNode: DiagramNode = {
      id: Date.now().toString(),
      type,
      x: 300,
      y: 250,
      label: nodeTypes[type].label,
    };
    setDiagramNodes([...diagramNodes, newNode]);
  };

  const deleteDiagramNode = (id: string) => {
    setDiagramNodes(diagramNodes.filter(n => n.id !== id));
  };

  const updateDiagramNodePosition = (id: string, x: number, y: number) => {
    setDiagramNodes(diagramNodes.map(n => n.id === id ? { ...n, x, y } : n));
  };

  const updateDiagramNodeLabel = (id: string, label: string) => {
    setDiagramNodes(diagramNodes.map(n => n.id === id ? { ...n, label } : n));
  };

  // Render Functions
  const renderConnection = (conn: Connection) => {
    const fromNode = flowNodes.find(n => n.id === conn.from);
    const toNode = flowNodes.find(n => n.id === conn.to);
    
    if (!fromNode || !toNode) return null;

    const x1 = fromNode.x;
    const y1 = fromNode.y + 40;
    const x2 = toNode.x;
    const y2 = toNode.y - 40;

    const midY = (y1 + y2) / 2;

    return (
      <g key={`${conn.from}-${conn.to}`}>
        <defs>
          <marker
            id={`arrowhead-${conn.from}-${conn.to}`}
            markerWidth="10"
            markerHeight="10"
            refX="9"
            refY="3"
            orient="auto"
          >
            <polygon points="0 0, 10 3, 0 6" fill="#a855f7" />
          </marker>
        </defs>
        <motion.path
          initial={{ pathLength: 0, opacity: 0 }}
          animate={{ pathLength: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          d={`M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`}
          stroke="url(#gradient)"
          strokeWidth="3"
          fill="none"
          markerEnd={`url(#arrowhead-${conn.from}-${conn.to})`}
        />
        {conn.label && (
          <text
            x={(x1 + x2) / 2}
            y={midY}
            fill="#c084fc"
            fontSize="14"
            fontWeight="bold"
            textAnchor="middle"
            className="pointer-events-none"
          >
            {conn.label}
          </text>
        )}
      </g>
    );
  };

  const renderFlowNode = (node: FlowNode) => {
    const shape = nodeShapes[node.type];
    const isSelected = selectedFlowNode === node.id;

    return (
      <g key={node.id}>
        {/* Glow effect */}
        {isSelected && (
          <motion.rect
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            x={node.x - 80}
            y={node.y - 45}
            width="160"
            height="90"
            rx="15"
            fill={`url(#${node.type}-glow)`}
            className="blur-xl"
          />
        )}

        {/* Node shape */}
        <motion.g
          drag
          dragMomentum={false}
          onDragEnd={(e, info) => {
            updateFlowNodePosition(node.id, node.x + info.offset.x, node.y + info.offset.y);
          }}
          whileHover={{ scale: 1.05 }}
          onClick={() => setSelectedFlowNode(node.id)}
          className="cursor-move"
        >
          {node.type === "decision" ? (
            <path
              d={`M ${node.x} ${node.y - 40} L ${node.x + 60} ${node.y} L ${node.x} ${node.y + 40} L ${node.x - 60} ${node.y} Z`}
              fill={`url(#${node.type}-gradient)`}
              stroke={isSelected ? "#ec4899" : "#a855f7"}
              strokeWidth={isSelected ? "3" : "2"}
              className="drop-shadow-2xl"
            />
          ) : (
            <rect
              x={node.x - 70}
              y={node.y - 40}
              width="140"
              height="80"
              rx={node.type === "start" || node.type === "end" ? "40" : "12"}
              fill={`url(#${node.type}-gradient)`}
              stroke={isSelected ? "#ec4899" : "#a855f7"}
              strokeWidth={isSelected ? "3" : "2"}
              className="drop-shadow-2xl"
            />
          )}

          <text
            x={node.x}
            y={node.y}
            textAnchor="middle"
            dominantBaseline="middle"
            fill="white"
            fontSize="14"
            fontWeight="bold"
            className="pointer-events-none select-none"
          >
            {node.text}
          </text>

          {/* Delete button */}
          {isSelected && (
            <g onClick={(e) => { e.stopPropagation(); deleteFlowNode(node.id); }}>
              <circle cx={node.x + 70} cy={node.y - 40} r="12" fill="#ef4444" className="cursor-pointer" />
              <line x1={node.x + 66} y1={node.y - 44} x2={node.x + 74} y2={node.y - 36} stroke="white" strokeWidth="2" />
              <line x1={node.x + 74} y1={node.y - 44} x2={node.x + 66} y2={node.y - 36} stroke="white" strokeWidth="2" />
            </g>
          )}
        </motion.g>
      </g>
    );
  };

  // Selection Screen
  if (mode === "selection") {
    return (
      <div className="p-8 h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-white mb-3 flex items-center justify-center gap-3">
            <Network className="w-10 h-10 text-purple-400" />
            Editor Visual Inteligente
          </h1>
          <p className="text-lg text-slate-400">
            Escolha um template ou crie do zero
          </p>
        </div>

        {/* Create from Blank */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Plus className="w-6 h-6 text-purple-400" />
            Criar do Zero
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <motion.button
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => createBlank("flowchart")}
              className="group relative p-8 bg-[#252034]/60 backdrop-blur-xl border-2 border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all text-left overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/10 group-hover:to-pink-500/10 transition-all" />

              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg shadow-purple-500/30">
                  <GitBranch className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Fluxograma em Branco</h3>
                <p className="text-slate-400">
                  Crie processos, decisões e fluxos lógicos do zero
                </p>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => createBlank("diagram")}
              className="group relative p-8 bg-[#252034]/60 backdrop-blur-xl border-2 border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all text-left overflow-hidden"
            >
              {/* Background Glow */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/10 group-hover:to-cyan-500/10 transition-all" />

              <div className="relative z-10">
                <div className="w-16 h-16 mb-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                  <Workflow className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold text-white mb-2">Diagrama em Branco</h3>
                <p className="text-slate-400">
                  Crie arquiteturas de sistema e componentes personalizados
                </p>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Templates */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-purple-400" />
            Templates Prontos
          </h2>

          {/* Flowchart Templates */}
          <div className="mb-10">
            <h3 className="text-xl font-bold text-purple-300 mb-4">Fluxogramas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.filter(t => t.type === "flowchart").map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadTemplate(template)}
                  className="group relative p-6 bg-[#252034]/40 backdrop-blur-xl border border-purple-500/20 rounded-2xl hover:border-purple-500/50 transition-all text-left overflow-hidden"
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-purple-500/0 to-pink-500/0 group-hover:from-purple-500/5 group-hover:to-pink-500/5 transition-all" />

                  <div className="relative z-10">
                    <div className="text-5xl mb-3">{template.preview}</div>
                    <h4 className="text-lg font-bold text-white mb-2">{template.name}</h4>
                    <p className="text-sm text-slate-400">{template.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>

          {/* Diagram Templates */}
          <div>
            <h3 className="text-xl font-bold text-blue-300 mb-4">Diagramas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates.filter(t => t.type === "diagram").map((template) => (
                <motion.button
                  key={template.id}
                  whileHover={{ scale: 1.05, y: -5 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => loadTemplate(template)}
                  className="group relative p-6 bg-[#252034]/40 backdrop-blur-xl border border-blue-500/20 rounded-2xl hover:border-blue-500/50 transition-all text-left overflow-hidden"
                >
                  {/* Background Glow */}
                  <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 to-cyan-500/0 group-hover:from-blue-500/5 group-hover:to-cyan-500/5 transition-all" />

                  <div className="relative z-10">
                    <div className="text-5xl mb-3">{template.preview}</div>
                    <h4 className="text-lg font-bold text-white mb-2">{template.name}</h4>
                    <p className="text-sm text-slate-400">{template.description}</p>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 h-[calc(100vh-120px)] flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-white mb-2 flex items-center gap-3">
            <button
              onClick={() => setMode("selection")}
              className="p-2 hover:bg-white/10 rounded-lg transition-all"
            >
              <Network className="w-8 h-8 text-purple-400" />
            </button>
            Editor Visual Inteligente
            <span className="px-3 py-1 bg-purple-500/20 border border-purple-500/30 text-purple-300 text-sm rounded-full flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              {mode === "flowchart" ? "Fluxograma" : "Diagrama"}
            </span>
          </h1>
          <p className="text-slate-400">
            {mode === "flowchart"
              ? "Crie fluxogramas interativos com visual futurista"
              : "Crie diagramas de arquitetura e fluxos de sistema"}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setMode("selection")}
            className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-xl text-purple-300 font-medium hover:bg-white/10 transition-all flex items-center gap-2"
          >
            Voltar
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-4 py-2 bg-white/5 border border-purple-500/30 rounded-xl text-purple-300 font-medium hover:bg-white/10 transition-all flex items-center gap-2"
          >
            <Download className="w-5 h-5" />
            Exportar
          </motion.button>
        </div>
      </div>

      <div className="flex-1 flex gap-6 overflow-hidden">
        {/* Toolbar */}
        <div className="w-64 bg-[#252034]/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl p-6 shadow-xl overflow-y-auto">
          {mode === "flowchart" ? (
            <>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                Adicionar Nós
              </h3>

              <div className="space-y-3 mb-6">
                {Object.entries(nodeShapes).map(([type, config]) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addFlowNode(type as any)}
                    className="w-full p-3 bg-white/5 border border-purple-500/20 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 group"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color}`}>
                      <config.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium capitalize">{type}</span>
                  </motion.button>
                ))}
              </div>

              <div className="pt-6 border-t border-purple-500/20 mb-6">
                <h3 className="text-white font-bold mb-4">Controles</h3>
                <div className="space-y-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setZoom(Math.min(zoom + 0.1, 2))}
                    className="w-full p-2 bg-white/5 border border-purple-500/20 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white"
                  >
                    <ZoomIn className="w-4 h-4" />
                    Zoom In
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setZoom(Math.max(zoom - 0.1, 0.5))}
                    className="w-full p-2 bg-white/5 border border-purple-500/20 rounded-lg hover:bg-white/10 transition-all flex items-center justify-center gap-2 text-white"
                  >
                    <ZoomOut className="w-4 h-4" />
                    Zoom Out
                  </motion.button>
                </div>
              </div>

              {selectedFlowNode && (
                <div className="pt-6 border-t border-purple-500/20">
                  <h3 className="text-white font-bold mb-4">Editar Nó</h3>
                  <input
                    type="text"
                    value={flowNodes.find(n => n.id === selectedFlowNode)?.text || ""}
                    onChange={(e) => updateFlowNodeText(selectedFlowNode, e.target.value)}
                    className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                    placeholder="Texto do nó..."
                  />
                </div>
              )}
            </>
          ) : (
            <>
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-purple-400" />
                Componentes
              </h3>

              <div className="space-y-2 mb-6">
                {Object.entries(nodeTypes).map(([type, config]) => (
                  <motion.button
                    key={type}
                    whileHover={{ scale: 1.05, x: 5 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => addDiagramNode(type as any)}
                    className="w-full p-3 bg-white/5 border border-purple-500/20 rounded-xl hover:bg-white/10 transition-all flex items-center gap-3 group"
                  >
                    <div className={`p-2 rounded-lg bg-gradient-to-r ${config.color} shadow-lg`}>
                      <config.icon className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-white font-medium">{config.label}</span>
                  </motion.button>
                ))}
              </div>

              {selectedDiagramNode && (
                <div className="pt-6 border-t border-purple-500/20 mb-6">
                  <h3 className="text-white font-bold mb-4">Editar Componente</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-slate-400 text-sm mb-2 block">Nome</label>
                      <input
                        type="text"
                        value={diagramNodes.find(n => n.id === selectedDiagramNode)?.label || ""}
                        onChange={(e) => updateDiagramNodeLabel(selectedDiagramNode, e.target.value)}
                        className="w-full bg-white/5 border border-purple-500/30 rounded-lg px-3 py-2 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                        placeholder="Nome do componente..."
                      />
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => deleteDiagramNode(selectedDiagramNode)}
                      className="w-full p-2 bg-red-500/20 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-all text-red-400 font-medium"
                    >
                      Remover Componente
                    </motion.button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Canvas */}
        <div className="flex-1 bg-[#252034]/60 backdrop-blur-xl border border-purple-500/20 rounded-2xl shadow-xl overflow-hidden relative">
          {mode === "flowchart" ? (
            <>
              {/* Grid background */}
              <div className="absolute inset-0 opacity-10">
                <svg width="100%" height="100%">
                  <defs>
                    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <circle cx="0.5" cy="0.5" r="0.5" fill="#a855f7" />
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#grid)" />
                </svg>
              </div>

              <svg width="100%" height="100%" style={{ transform: `scale(${zoom})`, transformOrigin: 'center' }}>
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  {Object.entries(nodeShapes).map(([type, config]) => (
                    <linearGradient key={type} id={`${type}-gradient`} x1="0%" y1="0%" x2="100%" y2="100%">
                      <stop offset="0%" stopColor={config.color.includes("emerald") ? "#10b981" : 
                                                  config.color.includes("blue") ? "#3b82f6" :
                                                  config.color.includes("purple") ? "#a855f7" : "#ef4444"} />
                      <stop offset="100%" stopColor={config.color.includes("teal") ? "#14b8a6" : 
                                                    config.color.includes("cyan") ? "#06b6d4" :
                                                    config.color.includes("pink") ? "#ec4899" : "#f97316"} />
                    </linearGradient>
                  ))}

                  {Object.entries(nodeShapes).map(([type]) => (
                    <radialGradient key={`${type}-glow`} id={`${type}-glow`}>
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.8" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0" />
                    </radialGradient>
                  ))}
                </defs>

                {connections.map(renderConnection)}
                {flowNodes.map(renderFlowNode)}
              </svg>
            </>
          ) : (
            <>
              {/* Grid background com efeito neon */}
              <div className="absolute inset-0" style={{
                backgroundImage: `
                  linear-gradient(rgba(168, 85, 247, 0.1) 1px, transparent 1px),
                  linear-gradient(90deg, rgba(168, 85, 247, 0.1) 1px, transparent 1px)
                `,
                backgroundSize: '40px 40px'
              }} />

              <svg width="100%" height="100%" className="relative z-10">
                <defs>
                  {/* Gradientes para conexões */}
                  <linearGradient id="connection-gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="#a855f7" />
                    <stop offset="100%" stopColor="#ec4899" />
                  </linearGradient>

                  {/* Glow effects */}
                  <filter id="glow">
                    <feGaussianBlur stdDeviation="4" result="coloredBlur"/>
                    <feMerge>
                      <feMergeNode in="coloredBlur"/>
                      <feMergeNode in="SourceGraphic"/>
                    </feMerge>
                  </filter>

                  <radialGradient id="node-bg">
                    <stop offset="0%" stopColor="#252034" />
                    <stop offset="100%" stopColor="#1a1625" />
                  </radialGradient>
                </defs>

                {/* Conexões automáticas entre nós próximos */}
                {diagramNodes.map((node, i) => 
                  diagramNodes.slice(i + 1).map((otherNode) => {
                    const distance = Math.sqrt(
                      Math.pow(node.x - otherNode.x, 2) + Math.pow(node.y - otherNode.y, 2)
                    );
                    if (distance < 400) {
                      return (
                        <line
                          key={`${node.id}-${otherNode.id}`}
                          x1={node.x}
                          y1={node.y}
                          x2={otherNode.x}
                          y2={otherNode.y}
                          stroke="url(#connection-gradient)"
                          strokeWidth="2"
                          strokeDasharray="5,5"
                          opacity="0.4"
                        />
                      );
                    }
                    return null;
                  })
                )}

                {/* Nós */}
                {diagramNodes.map((node) => {
                  const config = nodeTypes[node.type];
                  const Icon = config.icon;
                  const isSelected = selectedDiagramNode === node.id;

                  return (
                    <g key={node.id}>
                      {/* Glow quando selecionado */}
                      {isSelected && (
                        <motion.circle
                          initial={{ r: 0, opacity: 0 }}
                          animate={{ r: 70, opacity: 0.2 }}
                          cx={node.x}
                          cy={node.y}
                          fill="url(#connection-gradient)"
                          className="blur-xl"
                        />
                      )}

                      <motion.g
                        drag
                        dragMomentum={false}
                        onDragEnd={(e, info) => {
                          updateDiagramNodePosition(node.id, node.x + info.offset.x, node.y + info.offset.y);
                        }}
                        whileHover={{ scale: 1.1 }}
                        onClick={() => setSelectedDiagramNode(node.id)}
                        className="cursor-move"
                      >
                        {/* Círculo de fundo */}
                        <circle
                          cx={node.x}
                          cy={node.y}
                          r="50"
                          fill="url(#node-bg)"
                          stroke={isSelected ? "#ec4899" : "#a855f7"}
                          strokeWidth={isSelected ? "3" : "2"}
                          filter="url(#glow)"
                        />

                        {/* Ícone */}
                        <foreignObject x={node.x - 20} y={node.y - 30} width="40" height="40">
                          <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${config.color} flex items-center justify-center`}>
                            <Icon className="w-6 h-6 text-white" />
                          </div>
                        </foreignObject>

                        {/* Label */}
                        <text
                          x={node.x}
                          y={node.y + 20}
                          textAnchor="middle"
                          fill="white"
                          fontSize="12"
                          fontWeight="bold"
                          className="pointer-events-none select-none"
                        >
                          {node.label}
                        </text>
                      </motion.g>
                    </g>
                  );
                })}
              </svg>

              {/* Instruções */}
              <div className="absolute bottom-6 left-6 bg-[#1a1625]/80 backdrop-blur-xl border border-purple-500/20 rounded-xl p-4 max-w-xs">
                <p className="text-slate-300 text-sm">
                  <span className="font-bold text-purple-400">💡 Dica:</span> Arraste os componentes para organizá-los. 
                  Componentes próximos são conectados automaticamente.
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
