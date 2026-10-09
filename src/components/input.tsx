import type { InputHTMLAttributes, JSX } from "react";

type TextFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  hint?: string;
  isLabelHidden?: boolean;
};

export function TextField({
  id,
  label,
  hint,
  isLabelHidden = false,
  className = "",
  ...rest
}: TextFieldProps): JSX.Element {
  const hintId = hint === undefined ? undefined : `${id}-hint`;
  return (
    <div className={`flex flex-col gap-1.5 ${className}`}>
      <label htmlFor={id} className={isLabelHidden ? "sr-only" : "text-xs font-medium tracking-wide text-ink-subtle"}>
        {label}
      </label>
      <input
        id={id}
        aria-describedby={hintId}
        className="min-h-11 w-full rounded-xl border border-line bg-surface-muted px-3.5 text-base sm:text-sm text-ink placeholder:text-ink-subtle transition-colors duration-150 outline-none hover:border-line-strong focus-visible:border-line-strong focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
        {...rest}
      />
      {hint === undefined ? null : (
        <p id={hintId} className="text-xs text-ink-subtle">
          {hint}
        </p>
      )}
    </div>
  );
}
