import { JSX } from "react";

type NotionAiFaceIconProps = {
  className?: string;
};

export function NotionAiFaceIcon({
  className,
}: NotionAiFaceIconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M12 3.5L13.2 6.8L16.5 8L13.2 9.2L12 12.5L10.8 9.2L7.5 8L10.8 6.8L12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <circle cx="9" cy="15" r="1" fill="currentColor" />
      <circle cx="15" cy="15" r="1" fill="currentColor" />
      <path
        d="M9.5 18C10.1 18.5 10.9 18.8 12 18.8C13.1 18.8 13.9 18.5 14.5 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}