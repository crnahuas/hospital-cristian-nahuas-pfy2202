export default function LoadingState({ label }) {
  return (
    <div className="loading" role="status" aria-live="polite">
      <div className="reading-loader" aria-hidden="true">
        <span className="spinner" />
        <svg viewBox="0 0 48 48" fill="none">
          <path
            d="M7 12q9-3 17 3 8-6 17-3v25q-9-3-17 3-8-6-17-3V12Z"
            fill="var(--paper)"
            stroke="var(--color-1)"
            strokeWidth="2.5"
          />
          <path
            d="M24 15v25M12 20l6 1M12 26l6 1M30 21l6-1M30 27l6-1"
            stroke="var(--color-1)"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <div className="loading-copy">
        <p className="loading-title">Cargando {label}…</p>
        <p className="loading-detail">La consulta sigue en curso.</p>
      </div>
      <div className="loading-track" aria-hidden="true">
        <span />
      </div>
    </div>
  );
}
