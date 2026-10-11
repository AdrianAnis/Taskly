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

export function UserIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </IconFrame>
  );
}

export function MailIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <rect width="20" height="16" x="2" y="4" rx="2" />
      <path d="m22 7-8.97 5.7a1.94 1.94 0 01-2.06 0L2 7" />
    </IconFrame>
  );
}

export function PhoneIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
    </IconFrame>
  );
}

export function LogOutIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4" />
      <polyline points="16 17 21 12 16 7" />
      <line x1="21" y1="12" x2="9" y2="12" />
    </IconFrame>
  );
}

export function XIcon(props: IconProps): JSX.Element {
  return (
    <IconFrame {...props}>
      <path d="M18 6L6 18M6 6l12 12" />
    </IconFrame>
  );
}

