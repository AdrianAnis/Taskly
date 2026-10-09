import type { JSX, SVGProps } from "react";

type IconProps = SVGProps<SVGSVGElement>;

function IconFrame({ children, ...rest }: IconProps): JSX.Element {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      className="size-4"
      {...rest}
    >
      {children}
    </svg>
  );
}

export function CheckIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </IconFrame>
  );
}

export function PencilIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M4 20h4L19 9l-4-4L4 16v4z" />
      <path d="M13.5 6.5l4 4" />
    </IconFrame>
  );
}

export function TrashIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M4 7h16" />
      <path d="M10 11v6M14 11v6" />
      <path d="M6 7l1 13h10l1-13" />
      <path d="M9 7V4h6v3" />
    </IconFrame>
  );
}

export function ClockIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <circle cx="12" cy="12" r="8.5" />
      <path d="M12 7.5V12l3 2" />
    </IconFrame>
  );
}

export function UndoIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M9 14L4 9l5-5" />
      <path d="M4 9h10a6 6 0 010 12h-3" />
    </IconFrame>
  );
}
