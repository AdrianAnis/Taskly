import type { JSX, ReactNode } from "react";

type BadgeProps = {
  className?: string;
  children: ReactNode;
};

export function Badge({ className = "", children }: BadgeProps): JSX.Element {
  return (
    <span
      className={`inline-flex h-6 items-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap ${className}`}
    >
      {children}
    </span>
  );
}
