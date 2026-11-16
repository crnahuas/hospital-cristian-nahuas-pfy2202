import { Link } from "react-router";
import usePageTitle from "../hooks/usePageTitle.js";
import StateArt from "../components/StateArt.jsx";
export default function NotFound() {
  usePageTitle("Página no encontrada");
  return (
    <div className="wrap page-content not-found-page">
      <section className="not-found-panel">
        <div className="not-found-visual">
          <StateArt kind="missing" />
          <span aria-hidden="true">404</span>
        </div>
        <div className="not-found-copy">
          <h1>Página no encontrada</h1>
          <p>Revisa la dirección o vuelve al catálogo para buscar un libro.</p>
          <Link className="button" to="/catalogo">
            Volver al catálogo
          </Link>
        </div>
      </section>
    </div>
  );
}
