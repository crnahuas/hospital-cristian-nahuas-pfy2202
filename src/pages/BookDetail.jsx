import { Link, useParams } from "react-router";
import { useResource } from "../hooks/useResource.js";
import usePageTitle from "../hooks/usePageTitle.js";
import { BookCover, formatPrice } from "../components/BookCard.jsx";
import RequestState from "../components/RequestState.jsx";
import ServiceControls from "../components/ServiceControls.jsx";

export default function BookDetail() {
  const { bookId } = useParams();
  const resource = useResource(`books/${encodeURIComponent(bookId)}`, {
    shape: "object",
    interactive: true,
  });
  const categories = useResource("categories");
  const book = resource.data;
  const category = categories.data?.find(
    (item) => item.id === book?.categoryId,
  );
  usePageTitle(book?.title || "Detalle del libro");
  return (
    <div className="wrap page-content">
      <p className="breadcrumbs">
        <Link to="/">Inicio</Link> / <Link to="/catalogo">Catálogo</Link> /{" "}
        {book?.title || "Detalle del libro"}
      </p>
      <RequestState resource={resource} label="el libro" />
      {!book && (
        <h1 className="sr-only">
          {resource.isError ? "Libro no disponible" : "Detalle del libro"}
        </h1>
      )}
      {book && (
        <article className="book-detail" aria-busy={resource.isFetching}>
          <div className="detail-cover-group">
            <div className="detail-cover">
              <BookCover book={book} large />
            </div>
            {book.coverSource && (
              <p className="cover-credit">
                Portada de{" "}
                <a href={book.coverSource} target="_blank" rel="noreferrer">
                  Open Library
                </a>
              </p>
            )}
          </div>
          <div className="detail-copy">
            <Link
              className="detail-category"
              to={`/categorias/${book.categoryId}`}
            >
              {category?.name || book.categoryId.replaceAll("-", " ")}
            </Link>
            <h1>{book.title}</h1>
            <p className="detail-author">{book.author}</p>
            <p className="detail-price">
              {formatPrice(book.price)} <small>CLP</small>
            </p>
            <p className="synopsis">{book.description}</p>
            <dl className="book-facts">
              <div>
                <dt>Publicación original</dt>
                <dd>{book.year || "No informada"}</dd>
              </div>
              <div>
                <dt>Páginas de esta edición</dt>
                <dd>{book.pages || "No informadas"}</dd>
              </div>
              <div>
                <dt>Idioma</dt>
                <dd>Español</dd>
              </div>
            </dl>
            <Link className="button" to={`/categorias/${book.categoryId}`}>
              Ver más de {category?.name || "esta categoría"}{" "}
            </Link>
          </div>
        </article>
      )}
      <RequestState resource={categories} label="la categoría del libro" />
      <ServiceControls resource={resource} allowEmpty={false} />
    </div>
  );
}
