import { Link } from "react-router";
import usePageTitle from "../hooks/usePageTitle.js";

export default function About() {
  usePageTitle("La librería");
  return (
    <div className="wrap page-content about-page">
      <h1>Sobre Entre Líneas</h1>
      <p className="about-lead">Una librería para elegir con calma.</p>
      <p>
        Reunimos novelas, poesía, fantasía y aventuras. Puedes buscar por título
        o autor, comparar precios y consultar la sinopsis de cada libro antes de
        elegir.
      </p>
      <h2>Las portadas</h2>
      <p>
        Las portadas provienen de{" "}
        <a
          className="inline-link"
          href="https://openlibrary.org"
          target="_blank"
          rel="noreferrer"
        >
          Open Library
        </a>
        .
      </p>
      <Link className="button" to="/catalogo">
        Ver el catálogo
      </Link>
    </div>
  );
}
