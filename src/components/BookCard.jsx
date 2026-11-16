import { Link } from "react-router";
import { useState } from "react";

export const formatPrice = (price) =>
  new Intl.NumberFormat("es-CL", { style: "currency", currency: "CLP" }).format(
    price,
  );

export function BookCover({ book, large = false }) {
  const [failedImage, setFailedImage] = useState(null);
  const showImage = book.coverImage && failedImage !== book.coverImage;
  return (
    <div
      aria-hidden="true"
      className={`book-cover ${book.accent || "wine"} ${book.title.length > 40 ? "long-title" : ""} ${large ? "large" : ""} ${showImage ? "book-cover--image" : ""}`}
    >
      {showImage ? (
        <img
          src={book.coverImage}
          alt=""
          loading={large ? "eager" : "lazy"}
          decoding="async"
          onError={() => setFailedImage(book.coverImage)}
        />
      ) : (
        <>
          <span className="cover-author">{book.author}</span>
          <span className="cover-title">{book.title}</span>
          <span className="cover-art" />
          <span className="cover-publisher">entre líneas</span>
        </>
      )}
    </div>
  );
}

export default function BookCard({ book, categoryName }) {
  return (
    <article className="book-card">
      <Link
        className="cover-link"
        tabIndex={-1}
        aria-hidden="true"
        to={`/libros/${book.id}`}
      >
        <BookCover book={book} />
      </Link>
      <p className="book-category">
        {categoryName || book.categoryId.replaceAll("-", " ")}
      </p>
      <h2>
        <Link to={`/libros/${book.id}`}>{book.title}</Link>
      </h2>
      <p className="book-author">{book.author}</p>
      <div className="book-card-bottom">
        <p className="book-price">
          {formatPrice(book.price)} <span>CLP</span>
        </p>
        <Link
          className="book-card-link"
          to={`/libros/${book.id}`}
          aria-label={`Ver libro: ${book.title}`}
        >
          Ver libro
        </Link>
      </div>
    </article>
  );
}
