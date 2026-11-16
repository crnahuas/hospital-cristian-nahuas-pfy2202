import { useLayoutEffect, useRef } from "react";
import { Link, NavLink, Outlet, useLocation, useNavigate } from "react-router";
import BrandLogo from "./BrandLogo.jsx";

export default function Layout() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const mainRef = useRef(null);
  const previousPath = useRef(pathname);
  useLayoutEffect(() => {
    if (previousPath.current === pathname) return;
    previousPath.current = pathname;
    // El foco accesible no debe desplazar la cabecera fuera de la vista.
    mainRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);
  return (
    <>
      <a
        className="skip-link"
        href="#main-content"
        onClick={(event) => {
          event.preventDefault();
          mainRef.current?.focus();
        }}
      >
        Saltar al contenido
      </a>
      <header className="site-header wrap">
        <Link to="/" className="brand" aria-label="Entre Líneas, inicio">
          <BrandLogo />
        </Link>
        <nav aria-label="Navegación principal">
          <NavLink to="/" end>
            Inicio
          </NavLink>
          <NavLink to="/catalogo">Catálogo</NavLink>
          <NavLink to="/categorias">Categorías</NavLink>
          <NavLink to="/acerca">La librería</NavLink>
        </nav>
        <form
          className="header-search"
          action=""
          onSubmit={(event) => {
            event.preventDefault();
            const query = new FormData(event.currentTarget).get("q").trim();
            navigate(
              `/catalogo${query ? `?q=${encodeURIComponent(query)}` : ""}`,
            );
          }}
          role="search"
          aria-label="Buscar libros"
        >
          <input
            type="search"
            name="q"
            placeholder="Título o autor"
            aria-label="Título o autor"
            key={pathname}
          />
          <button type="submit" aria-label="Buscar">
            <svg
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="10.5"
                cy="10.5"
                r="6.5"
                stroke="currentColor"
                strokeWidth="1.7"
              />
              <path
                d="m16 16 4 4"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </form>
      </header>
      <main id="main-content" ref={mainRef} tabIndex={-1}>
        <Outlet />
      </main>
      <footer className="site-footer">
        <div className="wrap footer-inner">
          <div>
            <Link
              className="footer-brand"
              to="/"
              aria-label="Entre Líneas, volver al inicio"
            >
              <BrandLogo />
            </Link>
            <p>Libros para leer y regalar.</p>
          </div>
          <p>
            <Link to="/catalogo">Catálogo</Link> ·{" "}
            <Link to="/acerca">Sobre la librería</Link>
            <br />
            Precios en pesos chilenos
          </p>
        </div>
      </footer>
    </>
  );
}
