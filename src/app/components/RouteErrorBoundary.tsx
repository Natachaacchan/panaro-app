import { isRouteErrorResponse, Link, useRouteError } from "react-router-dom";

export function RouteErrorBoundary() {
  const error = useRouteError();

  const message = isRouteErrorResponse(error)
    ? `${error.status} ${error.statusText}`
    : error instanceof Error
      ? error.message
      : "Algo saiu do esperado.";

  return (
    <main className="app-shell app-shell--loading">
      <section className="content-panel route-error-card">
        <p className="eyebrow">Panora</p>
        <h1>Algo deu errado.</h1>
        <p className="page-copy">{message}</p>
        <div className="route-error-card__actions">
          <Link className="primary-button" to="/">
            Voltar ao inicio
          </Link>
          <Link className="ghost-button" to="/visual-editor">
            Abrir editor
          </Link>
        </div>
      </section>
    </main>
  );
}

