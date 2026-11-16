export default function StateArt({ kind = "missing" }) {
  return (
    <svg
      className={`state-art state-art--${kind}`}
      viewBox="0 0 220 180"
      fill="none"
      aria-hidden="true"
    >
      <ellipse
        cx="110"
        cy="156"
        rx="77"
        ry="10"
        fill="var(--color-2)"
        opacity=".15"
      />
      <circle cx="108" cy="83" r="67" fill="var(--color-4)" />
      <rect
        x="50"
        y="35"
        width="102"
        height="119"
        rx="11"
        fill="var(--color-1)"
      />
      <path
        d="M62 35v119"
        stroke="var(--color-5)"
        strokeWidth="3"
        opacity=".35"
      />
      <path
        d="M77 57h49M77 68h38"
        stroke="var(--color-5)"
        strokeWidth="5"
        strokeLinecap="round"
      />
      <path d="M130 35h13v38l-6.5-5-6.5 5V35Z" fill="var(--color-3)" />
      {kind === "missing" || kind === "empty" ? (
        <>
          <circle
            cx="139"
            cy="113"
            r="28"
            fill="var(--color-5)"
            stroke="var(--green)"
            strokeWidth="7"
          />
          <path
            d="m160 134 22 22"
            stroke="var(--green)"
            strokeWidth="12"
            strokeLinecap="round"
          />
          <path
            d="M132 111q7-14 16-3 4 6-5 10v5"
            stroke="var(--color-1)"
            strokeWidth="3.5"
            strokeLinecap="round"
          />
          <circle cx="142" cy="132" r="2" fill="var(--color-1)" />
        </>
      ) : kind === "offline" ? (
        <>
          <circle cx="143" cy="115" r="31" fill="var(--color-5)" />
          <path
            d="M122 108q21-20 42 0M129 117q14-13 28 0M139 126q4-4 8 0"
            stroke="var(--color-2)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="m122 135 40-40"
            stroke="var(--color-1)"
            strokeWidth="5"
            strokeLinecap="round"
          />
        </>
      ) : (
        <>
          <path
            d="m143 84 33 57a7 7 0 0 1-6 11h-66a7 7 0 0 1-6-11l33-57a7 7 0 0 1 12 0Z"
            fill="var(--color-3)"
            stroke="var(--color-5)"
            strokeWidth="4"
          />
          <path
            d="M137 107v21"
            stroke="var(--ink)"
            strokeWidth="5"
            strokeLinecap="round"
          />
          <circle cx="137" cy="140" r="3" fill="var(--ink)" />
        </>
      )}
    </svg>
  );
}
