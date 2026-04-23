import { motion } from "motion/react";
import { useState } from "react";
import { 
  Plus, 
  Search,
  FileText,
  Trash2,
  Star,
  MoreVertical,
  Tag,
  Clock
} from "lucide-react";

interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  starred: boolean;
  updatedAt: string;
  color: string;
}

const initialNotes: Note[] = [
  {
    id: "1",
    title: "Ideias para o Projeto",
    content: "• Implementar dark mode\n• Adicionar notificações push\n• Criar sistema de badges\n• Integração com calendário",
    tags: ["projeto", "ideias"],
    starred: true,
    updatedAt: "2026-02-11T10:30:00",
    color: "purple"
  },
  {
    id: "2",
    title: "Anotações da Reunião",
    content: "Pontos discutidos:\n- Roadmap do Q1\n- Novas contratações\n- Budget aprovado\n- Sprint planning",
    tags: ["reunião", "trabalho"],
    starred: false,
    updatedAt: "2026-02-10T14:20:00",
    color: "blue"
  },
  {
    id: "3",
    title: "Lista de Estudos",
    content: "📚 Tópicos para estudar:\n1. React Server Components\n2. TypeScript avançado\n3. Design Patterns\n4. System Design",
    tags: ["estudo", "desenvolvimento"],
    starred: true,
    updatedAt: "2026-02-09T09:15:00",
    color: "green"
  },
  {
    id: "4",
    title: "Receitas Favoritas",
    content: "🍝 Massa ao pesto\n🍕 Pizza margherita\n🥗 Salada caesar\n🍰 Bolo de chocolate",
    tags: ["pessoal", "receitas"],
    starred: false,
    updatedAt: "2026-02-08T18:45:00",
    color: "orange"
  },
  {
    id: "5",
    title: "Metas 2026",
    content: "✓ Aprender novo framework\n✓ Contribuir em open source\n○ Ler 12 livros\n○ Fazer um curso online",
    tags: ["metas", "pessoal"],
    starred: true,
    updatedAt: "2026-02-07T12:00:00",
    color: "pink"
  },
];

export function Notes() {
  const [notes, setNotes] = useState<Note[]>(initialNotes);
  const [selectedNote, setSelectedNote] = useState<Note | null>(notes[0]);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredNotes = notes.filter(note =>
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    note.tags.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const starredNotes = filteredNotes.filter(n => n.starred);
  const regularNotes = filteredNotes.filter(n => !n.starred);

  const toggleStar = (noteId: string) => {
    setNotes(notes.map(note =>
      note.id === noteId ? { ...note, starred: !note.starred } : note
    ));
  };

  const updateNoteTitle = (title: string) => {
    if (!selectedNote) return;
    const updatedNote = { ...selectedNote, title, updatedAt: new Date().toISOString() };
    setSelectedNote(updatedNote);
    setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
  };

  const updateNoteContent = (content: string) => {
    if (!selectedNote) return;
    const updatedNote = { ...selectedNote, content, updatedAt: new Date().toISOString() };
    setSelectedNote(updatedNote);
    setNotes(notes.map(note => note.id === selectedNote.id ? updatedNote : note));
  };

  const colorClasses = {
    purple: "from-purple-500 to-purple-600",
    blue: "from-blue-500 to-cyan-600",
    green: "from-green-500 to-emerald-600",
    orange: "from-orange-500 to-red-600",
    pink: "from-pink-500 to-rose-600",
  };

  return (
    <div className="p-8 h-[calc(100vh-120px)]">
      <div className="flex gap-6 h-full">
        {/* Sidebar */}
        <div className="w-80 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-slate-100">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-bold text-slate-800">Notas</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-shadow"
              >
                <Plus className="w-5 h-5" />
              </motion.button>
            </div>
            
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input
                type="text"
                placeholder="Buscar notas..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-50 border-0 rounded-xl pl-10 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 transition-all"
              />
            </div>
          </div>

          {/* Notes List */}
          <div className="flex-1 overflow-auto p-4 space-y-4">
            {/* Starred Notes */}
            {starredNotes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-2">
                  Favoritas
                </h3>
                <div className="space-y-2">
                  {starredNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedNote(note)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        selectedNote?.id === note.id
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold text-sm ${
                          selectedNote?.id === note.id ? 'text-white' : 'text-slate-800'
                        }`}>
                          {note.title}
                        </h4>
                        <Star
                          className={`w-4 h-4 ${
                            selectedNote?.id === note.id ? 'text-white fill-white' : 'text-yellow-500 fill-yellow-500'
                          }`}
                        />
                      </div>
                      <p className={`text-xs line-clamp-2 ${
                        selectedNote?.id === note.id ? 'text-white/80' : 'text-slate-600'
                      }`}>
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              selectedNote?.id === note.id
                                ? 'bg-white/20 text-white'
                                : 'bg-purple-50 text-purple-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Regular Notes */}
            {regularNotes.length > 0 && (
              <div>
                <h3 className="text-xs font-semibold text-slate-500 uppercase mb-2 px-2">
                  Todas as Notas
                </h3>
                <div className="space-y-2">
                  {regularNotes.map((note) => (
                    <motion.div
                      key={note.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      whileHover={{ x: 4 }}
                      onClick={() => setSelectedNote(note)}
                      className={`p-3 rounded-xl cursor-pointer transition-all ${
                        selectedNote?.id === note.id
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg'
                          : 'hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className={`font-semibold text-sm ${
                          selectedNote?.id === note.id ? 'text-white' : 'text-slate-800'
                        }`}>
                          {note.title}
                        </h4>
                        <Star
                          className={`w-4 h-4 ${
                            selectedNote?.id === note.id ? 'text-white/40' : 'text-slate-300'
                          }`}
                        />
                      </div>
                      <p className={`text-xs line-clamp-2 ${
                        selectedNote?.id === note.id ? 'text-white/80' : 'text-slate-600'
                      }`}>
                        {note.content}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        {note.tags.slice(0, 2).map((tag) => (
                          <span
                            key={tag}
                            className={`text-xs px-2 py-0.5 rounded-full ${
                              selectedNote?.id === note.id
                                ? 'bg-white/20 text-white'
                                : 'bg-purple-50 text-purple-600'
                            }`}
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Note Editor */}
        {selectedNote ? (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col"
          >
            {/* Editor Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-4">
                <input
                  type="text"
                  value={selectedNote.title}
                  onChange={(e) => updateNoteTitle(e.target.value)}
                  className="text-3xl font-bold text-slate-800 border-0 focus:outline-none flex-1"
                  placeholder="Título da nota..."
                />
                <div className="flex items-center gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => toggleStar(selectedNote.id)}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <Star className={`w-5 h-5 ${selectedNote.starred ? 'text-yellow-500 fill-yellow-500' : 'text-slate-400'}`} />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-slate-100 transition-colors"
                  >
                    <MoreVertical className="w-5 h-5 text-slate-400" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    className="p-2 rounded-lg hover:bg-red-50 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-red-500" />
                  </motion.button>
                </div>
              </div>

              {/* Tags */}
              <div className="flex items-center gap-2 flex-wrap">
                {selectedNote.tags.map((tag) => (
                  <span
                    key={tag}
                    className={`px-3 py-1 rounded-lg text-sm font-medium bg-gradient-to-r ${colorClasses[selectedNote.color as keyof typeof colorClasses]} text-white`}
                  >
                    <Tag className="w-3 h-3 inline mr-1" />
                    {tag}
                  </span>
                ))}
                <button className="px-3 py-1 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-100 transition-colors">
                  + Adicionar tag
                </button>
              </div>

              {/* Metadata */}
              <div className="flex items-center gap-4 mt-4 text-sm text-slate-500">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>
                    Atualizado {new Date(selectedNote.updatedAt).toLocaleDateString('pt-BR', {
                      day: 'numeric',
                      month: 'short',
                      hour: '2-digit',
                      minute: '2-digit'
                    })}
                  </span>
                </div>
              </div>
            </div>

            {/* Editor Content */}
            <div className="flex-1 p-6 overflow-auto">
              <textarea
                value={selectedNote.content}
                onChange={(e) => updateNoteContent(e.target.value)}
                className="w-full h-full text-slate-700 leading-relaxed resize-none border-0 focus:outline-none"
                placeholder="Comece a escrever..."
              />
            </div>
          </motion.div>
        ) : (
          <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 flex items-center justify-center">
            <div className="text-center">
              <FileText className="w-20 h-20 text-slate-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-slate-600 mb-2">
                Nenhuma nota selecionada
              </h3>
              <p className="text-slate-500">
                Selecione uma nota ou crie uma nova
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}