export default function BrandLogo() {
  return (
    <span className="brand-logo" aria-hidden="true">
      <svg
        className="brand-logo-mark"
        width="48"
        height="48"
        viewBox="0 0 56 56"
        fill="none"
      >
        <rect
          x="2"
          y="2"
          width="52"
          height="52"
          rx="16"
          fill="var(--color-1)"
        />
        <path d="M14 17h14v5h-8v4h7v5h-7v4h8v5H14V17Z" fill="var(--color-5)" />
        <path d="M32 17h6v18h7v5H32V17Z" fill="var(--color-5)" />
        <path d="M39 11h6v13l-3-2-3 2V11Z" fill="var(--color-3)" />
      </svg>
      <span className="brand-logo-wordmark">
        <span>entre</span>
        <span>líneas</span>
      </span>
    </span>
  );
}
