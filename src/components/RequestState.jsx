import { Link } from "react-router";
import LoadingState from "./LoadingState.jsx";
import StateArt from "./StateArt.jsx";

export default function RequestState({ resource, label }) {
  const status = resource.error?.status;
  const offline = resource.error?.message?.includes("conectar");
  const kind = status === 404 ? "missing" : offline ? "offline" : "server";
  const code = status
    ? String(status)
    : offline
      ? "Sin conexión"
      : "Respuesta inválida";
  return (
    <>
      {resource.isFetching && <LoadingState label={label} />}
      {resource.isError && (
        <div role="alert" className={`request-error request-error--${kind}`}>
          <StateArt kind={kind} />
          <div className="error-copy">
            <span className="error-code">{code}</span>
            <h2>No pudimos cargar {label}</h2>
            <p>{resource.error.message}</p>
            {resource.hasFallback && (
              <p>
                Mientras tanto, puedes revisar la última versión consultada.
              </p>
            )}
            <div className="inline-actions">
              <button
                className="button"
                onClick={resource.retry}
                disabled={resource.isFetching}
              >
                Reintentar
              </button>
              <Link className="text-link" to="/catalogo">
                Volver al catálogo
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
