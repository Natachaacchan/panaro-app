import { useEffect, useMemo, useRef, useState } from "react";
import type { MouseEvent as ReactMouseEvent } from "react";
import { useWorkspaceData } from "../hooks/useWorkspaceData";
import type { DiagramItem, DiagramItemType } from "../types/workspace";

const itemTypes: { type: DiagramItemType; label: string; accent: string }[] = [
  { type: "rectangle", label: "Fluxograma em Branco", accent: "editor-template-card__icon--pink" },
  { type: "circle", label: "Inicio Circular", accent: "editor-template-card__icon--purple" },
  { type: "diamond", label: "Decisao", accent: "editor-template-card__icon--violet" },
  { type: "connector", label: "Conector", accent: "editor-template-card__icon--blue" },
  { type: "arrow", label: "Seta", accent: "editor-template-card__icon--cyan" },
];

function getItemSize(type: DiagramItemType) {
  switch (type) {
    case "circle":
      return { width: 94, height: 94 };
    case "diamond":
      return { width: 110, height: 110 };
    case "connector":
      return { width: 144, height: 24 };
    case "arrow":
      return { width: 160, height: 28 };
    default:
      return { width: 148, height: 82 };
  }
}

function clampPosition(value: number, max: number) {
  return Math.min(Math.max(value, 24), Math.max(24, max));
}

function TemplateIcon({ type }: { type: DiagramItemType }) {
  return <span className={`editor-template-shape editor-template-shape--${type}`} aria-hidden="true" />;
}

export function VisualEditor() {
  const workspace = useWorkspaceData();
  const canvasRef = useRef<HTMLDivElement | null>(null);
  const dragRef = useRef<{ id: string; offsetX: number; offsetY: number } | null>(null);
  const [mode, setMode] = useState<"selection" | "canvas">("selection");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  const diagramItems = useMemo(() => workspace.diagramItems ?? [], [workspace.diagramItems]);
  const selectedItem = useMemo(
    () => diagramItems.find((item) => item.id === selectedId) ?? null,
    [diagramItems, selectedId]
  );

  function openCanvas(type?: DiagramItemType) {
    setMode("canvas");

    if (type) {
      workspace.addDiagramItem({ type });
    }
  }

  function startDrag(item: DiagramItem, event: ReactMouseEvent<HTMLButtonElement>) {
    const elementRect = event.currentTarget.getBoundingClientRect();
    dragRef.current = {
      id: item.id,
      offsetX: event.clientX - elementRect.left,
      offsetY: event.clientY - elementRect.top,
    };
    setSelectedId(item.id);
  }

  function createLinkedItem(source: DiagramItem, type: "connector" | "arrow") {
    const sourceSize = getItemSize(source.type);
    const nextLabel = type === "connector" ? "Conexao" : "Fluxo";
    const nextX = source.x + sourceSize.width + 28;
    const nextY = source.y + Math.round(sourceSize.height / 2) - (type === "connector" ? 12 : 14);

    const nextId = workspace.addDiagramItem({ type, label: nextLabel });
    workspace.updateDiagramItem(nextId, { x: nextX, y: nextY });
  }

  useEffect(() => {
    function onMouseMove(event: MouseEvent) {
      const dragState = dragRef.current;
      const canvas = canvasRef.current;

      if (!dragState || !canvas) {
        return;
      }

      const item = diagramItems.find((entry) => entry.id === dragState.id);
      if (!item) {
        return;
      }

      const rect = canvas.getBoundingClientRect();
      const size = getItemSize(item.type);
      const nextX = clampPosition(
        event.clientX - rect.left - dragState.offsetX,
        rect.width - size.width - 24
      );
      const nextY = clampPosition(
        event.clientY - rect.top - dragState.offsetY,
        rect.height - size.height - 24
      );

      workspace.updateDiagramItem(item.id, { x: nextX, y: nextY });
    }

    function onMouseUp() {
      dragRef.current = null;
    }

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseup", onMouseUp);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, [diagramItems, workspace]);

  if (mode === "selection") {
    return (
      <section className="page page--editor-reference">
        <div className="editor-reference__hero">
          <div className="editor-reference__title">
            <span className="editor-reference__network" aria-hidden="true">
              <span />
            </span>
            <h1>Editor Visual Inteligente</h1>
          </div>
          <p>Escolha um template ou crie do zero</p>
        </div>

        <section className="editor-reference__section">
          <h2>Criar do Zero</h2>
          <div className="editor-reference__cards">
            <button type="button" className="editor-template-card" onClick={() => openCanvas("rectangle")}>
              <span className="editor-template-card__icon editor-template-card__icon--pink">
                <TemplateIcon type="rectangle" />
              </span>
              <strong>Fluxograma em Branco</strong>
              <p>Crie processos, decisoes e fluxos do zero</p>
            </button>

            <button type="button" className="editor-template-card" onClick={() => openCanvas("connector")}>
              <span className="editor-template-card__icon editor-template-card__icon--blue">
                <TemplateIcon type="connector" />
              </span>
              <strong>Diagrama em Branco</strong>
              <p>Crie componentes e conexoes personalizadas</p>
            </button>
          </div>
        </section>

        <section className="editor-reference__section">
          <h2>Elementos Rapidos</h2>
          <div className="editor-reference__toolbar">
            {itemTypes.map((item) => (
              <button key={item.type} type="button" className="editor-tool-pill" onClick={() => openCanvas(item.type)}>
                <span className={`editor-template-card__icon ${item.accent}`}>
                  <TemplateIcon type={item.type} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>
        </section>
      </section>
    );
  }

  return (
    <section className="page page--editor-canvas">
      <div className="editor-canvas-header">
        <div>
          <h1>Editor Visual Inteligente</h1>
          <p>Arraste formas e construa seu fluxo</p>
        </div>
        <div className="editor-canvas-header__actions">
          <button type="button" className="ghost-button ghost-button--reference" onClick={() => setMode("selection")}>
            Voltar
          </button>
          <button type="button" className="ghost-button ghost-button--reference" onClick={() => workspace.clearDiagram()}>
            Limpar
          </button>
        </div>
      </div>

      <div className="editor-canvas-shell">
        <aside className="editor-canvas-sidebar">
          <h3>Elementos</h3>
          <div className="editor-canvas-sidebar__tools">
            {itemTypes.map((item) => (
              <button key={item.type} type="button" className="editor-canvas-tool" onClick={() => workspace.addDiagramItem({ type: item.type })}>
                <span className={`editor-template-card__icon ${item.accent}`}>
                  <TemplateIcon type={item.type} />
                </span>
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {selectedItem ? (
            <div className="editor-canvas-sidebar__inspector">
              <h4>Selecionado</h4>
              <input
                value={selectedItem.label}
                onChange={(event) => workspace.updateDiagramItem(selectedItem.id, { label: event.target.value })}
                placeholder="Nome do bloco"
              />
              <button type="button" className="ghost-button ghost-button--reference" onClick={() => workspace.removeDiagramItem(selectedItem.id)}>
                Remover
              </button>
            </div>
          ) : null}
        </aside>

        <div className="editor-canvas-board" ref={canvasRef}>
          {diagramItems.length === 0 ? (
            <div className="editor-canvas-board__empty">
              <strong>Canvas vazio</strong>
              <p>Escolha um elemento para comecar</p>
            </div>
          ) : null}

          {diagramItems.map((item) => {
            const size = getItemSize(item.type);
            const showHandles =
              item.type !== "connector" && item.type !== "arrow" && (hoveredId === item.id || selectedId === item.id);

            return (
              <button
                key={item.id}
                type="button"
                className={`diagram-item diagram-item--${item.type}${selectedId === item.id ? " diagram-item--selected" : ""}`}
                style={{
                  left: item.x,
                  top: item.y,
                  width: size.width,
                  height: size.height,
                }}
                onMouseDown={(event) => startDrag(item, event)}
                onClick={() => setSelectedId(item.id)}
                onMouseEnter={() => setHoveredId(item.id)}
                onMouseLeave={() => setHoveredId((current) => (current === item.id ? null : current))}
              >
                {selectedId === item.id && item.type !== "connector" && item.type !== "arrow" ? (
                  <input
                    className="diagram-item__input"
                    value={item.label}
                    onChange={(event) => workspace.updateDiagramItem(item.id, { label: event.target.value })}
                    onMouseDown={(event) => event.stopPropagation()}
                    onClick={(event) => event.stopPropagation()}
                    placeholder="Digite aqui"
                  />
                ) : (
                  <span>{item.label}</span>
                )}

                {showHandles ? (
                  <div className="diagram-item__handles" onMouseDown={(event) => event.stopPropagation()}>
                    <button
                      type="button"
                      className="diagram-handle diagram-handle--connector"
                      onClick={(event) => {
                        event.stopPropagation();
                        createLinkedItem(item, "connector");
                      }}
                      aria-label="Criar conector"
                      title="Criar conector"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      className="diagram-handle diagram-handle--arrow"
                      onClick={(event) => {
                        event.stopPropagation();
                        createLinkedItem(item, "arrow");
                      }}
                      aria-label="Criar seta"
                      title="Criar seta"
                    >
                      →
                    </button>
                  </div>
                ) : null}
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default VisualEditor;
