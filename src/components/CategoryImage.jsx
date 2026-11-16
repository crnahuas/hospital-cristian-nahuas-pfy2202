import { useState } from "react";

export default function CategoryImage({ category }) {
  const [failedImage, setFailedImage] = useState(null);
  const source = category.image?.startsWith("https://")
    ? category.image
    : `${import.meta.env.BASE_URL}${category.image || "favicon.svg"}`;
  const image =
    failedImage === source ? `${import.meta.env.BASE_URL}favicon.svg` : source;

  return (
    <span
      className={`category-image category-image--${category.id}`}
      aria-hidden="true"
    >
      <img
        src={image}
        alt=""
        width="92"
        height="126"
        loading="lazy"
        decoding="async"
        onError={() => setFailedImage(source)}
      />
    </span>
  );
}
