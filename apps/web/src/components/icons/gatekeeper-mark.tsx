import { JSX } from "react";

type GatekeeperMarkProps = {
  className?: string;
};

export function GatekeeperMark({ className }: GatekeeperMarkProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 72 72"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      fill="none"
    >
      <rect
        x="4"
        y="4"
        width="64"
        height="64"
        rx="20"
        fill="white"
        stroke="currentColor"
        strokeWidth="3.5"
      />

      <g stroke="currentColor" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="28" cy="20" r="6" />

        <path d="M24 27L18 34L15 46" />
        <path d="M32 27L38 33" />
        <path d="M23 34L31 34" />

        <path d="M24 34L21 47" />
        <path d="M31 34L34 47" />

        <path d="M21 47L16 57" />
        <path d="M34 47L29 58" />

        <path d="M38 33L50 27" />
        <path d="M50 27L56 39" />
      </g>

      <path
        d="M47 24L58 29V39C58 48 51.9 54.3 47 56C42.1 54.3 36 48 36 39V29L47 24Z"
        fill="white"
        stroke="currentColor"
        strokeWidth="3.5"
        strokeLinejoin="round"
      />

      <path d="M47 31V47" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
      <path d="M39.5 39H54.5" stroke="currentColor" strokeWidth="3.2" strokeLinecap="round" />
    </svg>
  );
}
