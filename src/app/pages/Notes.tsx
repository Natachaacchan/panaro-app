import { useState } from "react";
import type { FormEvent } from "react";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import type { NoteCategory } from "../types/workspace";

export function Notes() {
  const workspace = useWorkspaceData();
  const [title, setTitle] = useState("");
  const [summary, setSummary] = useState("");
  const [category, setCategory] = useState<NoteCategory>("product");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<"all" | NoteCategory>("all");

  const filteredNotes = workspace.notes.filter((note) => {
    const matchesCategory = filterCategory === "all" || note.category === filterCategory;
    const normalizedSearch = searchTerm.trim().toLowerCase();
    const matchesSearch =
      !normalizedSearch ||
      note.title.toLowerCase().includes(normalizedSearch) ||
      note.summary.toLowerCase().includes(normalizedSearch);

    return matchesCategory && matchesSearch;
  });

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    workspace.addNote({ title, summary, category });
    setTitle("");
    setSummary("");
    setCategory("product");
  }

  return (
    <section className="page">
      <div className="page-hero">
        <div>
          <p className="eyebrow">Notas</p>
          <h1>Base visual de contexto.</h1>
          <p className="page-copy">Organize referencias com leitura elegante e filtro rapido.</p>
        </div>
      </div>

      <section className="create-card">
        <div className="create-card__header">
          <div>
            <p className="eyebrow">Nova nota</p>
            <h3>Salvar uma referencia da conta atual</h3>
          </div>
        </div>
        <form className="form-grid" onSubmit={handleSubmit}>
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Titulo da nota"
            required
          />
          <select
            value={category}
            onChange={(event) => setCategory(event.target.value as NoteCategory)}
          >
            <option value="product">Produto</option>
            <option value="ops">Operacao</option>
            <option value="research">Pesquisa</option>
          </select>
          <input
            value={summary}
            onChange={(event) => setSummary(event.target.value)}
            placeholder="Resumo da nota"
            required
          />
          <button className="primary-button" type="submit">
            Salvar nota
          </button>
        </form>
      </section>

      <section className="create-card">
        <div className="create-card__header">
          <div>
            <p className="eyebrow">Explorar</p>
            <h3>Buscar e filtrar notas</h3>
          </div>
        </div>
        <div className="form-grid">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Buscar por titulo ou resumo"
          />
          <select
            value={filterCategory}
            onChange={(event) => setFilterCategory(event.target.value as "all" | NoteCategory)}
          >
            <option value="all">Todas as categorias</option>
            <option value="product">Produto</option>
            <option value="ops">Operacao</option>
            <option value="research">Pesquisa</option>
          </select>
        </div>
      </section>

      <div className="notes-grid">
        {filteredNotes.length > 0 ? (
          filteredNotes.map((note) => (
            <article key={note.id} className="note-card">
              <div className={`note-visual note-visual--${note.category}`}>
                <div className="note-visual__eyebrow">{note.category}</div>
                <strong>{note.title}</strong>
                <span>{note.updatedAt}</span>
              </div>
              <p className="eyebrow">{note.category}</p>
              <h3>{note.title}</h3>
              <p className="page-copy">{note.summary}</p>
              <small className="row-copy">Atualizada em {note.updatedAt}</small>
            </article>
          ))
        ) : (
          <div className="empty-state">
            <h3>Sem notas visiveis.</h3>
            <p className="page-copy">Ajuste os filtros ou crie a primeira.</p>
          </div>
        )}
      </div>
    </section>
  );
}

export default Notes;
