import type { ButtonHTMLAttributes, JSX } from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger";
type ButtonSize = "md" | "icon";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  size?: ButtonSize;
  isLoading?: boolean;
};

const BASE_CLASSES =
  "inline-flex min-h-11 items-center justify-center gap-2 rounded-lg text-sm font-medium transition-colors duration-150 outline-none focus-visible:ring-4 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50";

const VARIANT_CLASSES: Record<ButtonVariant, string> = {
  primary: "bg-accent text-on-accent shadow-sm hover:bg-accent-hover",
  secondary: "border border-line bg-surface text-ink hover:border-line-strong hover:bg-surface-muted",
  ghost: "text-ink-muted hover:bg-surface-muted hover:text-ink",
  danger: "bg-danger text-on-accent shadow-sm hover:bg-danger-hover",
};

const SIZE_CLASSES: Record<ButtonSize, string> = {
  md: "px-4",
  icon: "min-w-11",
};

function Spinner(): JSX.Element {
  return (
    <span
      aria-hidden="true"
      className="size-4 animate-spin rounded-full border-2 border-current border-r-transparent"
    />
  );
}

export function Button({
  variant = "primary",
  size = "md",
  isLoading = false,
  disabled,
  className = "",
  type = "button",
  children,
  ...rest
}: ButtonProps): JSX.Element {
  return (
    <button
      type={type}
      disabled={disabled === true || isLoading}
      aria-busy={isLoading}
      className={`${BASE_CLASSES} ${VARIANT_CLASSES[variant]} ${SIZE_CLASSES[size]} ${className}`}
      {...rest}
    >
      {isLoading ? <Spinner /> : null}
      {children}
    </button>
  );
}
