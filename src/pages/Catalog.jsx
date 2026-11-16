import { Link, useParams, useSearchParams } from "react-router";
import { useEffect, useRef } from "react";
import { useResource } from "../hooks/useResource.js";
import usePageTitle from "../hooks/usePageTitle.js";
import BookCard from "../components/BookCard.jsx";
import RequestState from "../components/RequestState.jsx";
import ServiceControls from "../components/ServiceControls.jsx";
import StateArt from "../components/StateArt.jsx";

export default function Catalog() {
  const { categoryId } = useParams();
  const [params, setParams] = useSearchParams();
  const latestParams = useRef(params);
  useEffect(() => {
    latestParams.current = params;
  }, [params]);
  const search = params.get("q") || "";
  const sort = params.get("sort") || "default";
  const categories = useResource("categories");
  const books = useResource(
    categoryId ? `books?category=${encodeURIComponent(categoryId)}` : "books",
    { interactive: true },
  );
  const category = categories.data?.find((item) => item.id === categoryId);
  const title =
    category?.name ||
    (categoryId ? "Libros por categoría" : "Todos los libros");
  const normalize = (value) =>
    value
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLocaleLowerCase("es");
  const visibleBooks = books.data?.filter((book) =>
    normalize(`${book.title} ${book.author}`).includes(
      normalize(search.trim()),
    ),
  );
  if (sort === "price-asc") visibleBooks?.sort((a, b) => a.price - b.price);
  if (sort === "price-desc") visibleBooks?.sort((a, b) => b.price - a.price);
  if (sort === "title")
    visibleBooks?.sort((a, b) => a.title.localeCompare(b.title, "es"));
  function updateParam(key, value) {
    // Conserva cambios consecutivos mientras React Router completa la navegación.
    const updated = new URLSearchParams(latestParams.current);
    if (value) updated.set(key, value);
    else updated.delete(key);
    latestParams.current = updated;
    setParams(updated, { replace: true });
  }
  usePageTitle(title);
  return (
    <div className="wrap page-content">
      <p className="breadcrumbs">
        <Link to="/">Inicio</Link> / <Link to="/catalogo">Catálogo</Link>
        {categoryId && <> / {category?.name || categoryId}</>}
      </p>
      <div className="page-heading">
        <h1>{title}</h1>
        <p>
          {category?.description ||
            "Elige por título, autor o categoría. Los precios están en pesos chilenos."}
        </p>
      </div>
      <div className="catalog-layout">
        <aside
          className="category-sidebar"
          aria-label="Filtrar libros por categoría"
        >
          <h2>Categorías</h2>
          <RequestState resource={categories} label="las categorías" />
          <nav aria-label="Categorías de libros">
            <Link
              to="/catalogo"
              aria-current={!categoryId ? "page" : undefined}
            >
              Todos los libros
            </Link>
            {categories.data?.map((item) => (
              <Link
                key={item.id}
                to={`/categorias/${item.id}`}
                aria-current={categoryId === item.id ? "page" : undefined}
              >
                {item.name}
              </Link>
            ))}
          </nav>
          {categories.data?.length === 0 && (
            <p>No hay categorías disponibles.</p>
          )}
        </aside>
        <section aria-label="Libros disponibles" aria-busy={books.isFetching}>
          <div className="catalog-toolbar">
            <p>
              {books.data
                ? `${visibleBooks.length} ${visibleBooks.length === 1 ? "libro" : "libros"}`
                : "Consultando catálogo"}
            </p>
            <div className="catalog-sort">
              <label htmlFor="book-sort">Ordenar</label>
              <select
                id="book-sort"
                value={sort}
                onChange={(event) => updateParam("sort", event.target.value)}
              >
                <option value="default">Orden original</option>
                <option value="price-asc">Menor precio</option>
                <option value="price-desc">Mayor precio</option>
                <option value="title">Título: A–Z</option>
              </select>
            </div>
            <button
              className="text-link"
              onClick={() => books.refetch()}
              disabled={books.isFetching}
            >
              Actualizar
            </button>
          </div>
          <div className="catalog-search">
            <label htmlFor="catalog-search">
              Buscar en {category?.name || "el catálogo"}
            </label>
            <input
              id="catalog-search"
              type="search"
              placeholder="Escribe un título o autor"
              value={search}
              onChange={(event) => updateParam("q", event.target.value)}
            />
            {search && (
              <button
                className="text-link"
                onClick={() => updateParam("q", "")}
              >
                Limpiar búsqueda
              </button>
            )}
          </div>
          <RequestState resource={books} label="los libros" />
          {visibleBooks?.length === 0 && !books.isFetching && (
            <div className="empty-state">
              <StateArt kind="empty" />
              <h2>
                {search
                  ? "No encontramos ese libro"
                  : "No hay libros en esta categoría"}
              </h2>
              <p>
                {search
                  ? "Prueba con otro título o con el nombre del autor."
                  : "Puedes consultar otra categoría o ver el catálogo completo."}
              </p>
              <Link className="button secondary" to="/catalogo">
                Ver todos los libros
              </Link>
            </div>
          )}
          <div className="book-grid">
            {visibleBooks?.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                categoryName={
                  categories.data?.find((item) => item.id === book.categoryId)
                    ?.name
                }
              />
            ))}
          </div>
          <ServiceControls resource={books} />
        </section>
      </div>
    </div>
  );
}
