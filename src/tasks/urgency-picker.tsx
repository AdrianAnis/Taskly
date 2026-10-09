import type { JSX } from "react";
import { URGENCY_OPTIONS, type Urgency } from "@/tasks/schema";
import { URGENCY_DOT_CLASSES, URGENCY_LABELS, URGENCY_PICKER_CHECKED_CLASSES } from "@/tasks/urgency-style";

type UrgencyPickerProps = {
  idPrefix: string;
  defaultValue: Urgency;
  isDisabled: boolean;
};

export function UrgencyPicker({ idPrefix, defaultValue, isDisabled }: UrgencyPickerProps): JSX.Element {
  return (
    <fieldset className="flex flex-col gap-1.5" disabled={isDisabled}>
      <legend className="mb-1.5 text-xs font-medium text-ink-muted">Urgensi</legend>
      <div className="grid grid-cols-3 gap-1 rounded-lg border border-line bg-surface-muted p-1">
        {URGENCY_OPTIONS.map((urgency) => (
          <label key={urgency} htmlFor={`${idPrefix}-urgency-${urgency}`} className="relative">
            <input
              id={`${idPrefix}-urgency-${urgency}`}
              type="radio"
              name="urgency"
              value={urgency}
              defaultChecked={urgency === defaultValue}
              className="peer sr-only"
            />
            <span
              className={`flex min-h-11 cursor-pointer items-center justify-center gap-1.5 rounded-md border border-transparent px-2 text-xs font-medium text-ink-muted transition-colors duration-150 hover:text-ink peer-focus-visible:ring-4 peer-focus-visible:ring-ring peer-disabled:cursor-not-allowed peer-disabled:opacity-50 ${URGENCY_PICKER_CHECKED_CLASSES[urgency]}`}
            >
              <span aria-hidden="true" className={`size-1.5 rounded-full ${URGENCY_DOT_CLASSES[urgency]}`} />
              {URGENCY_LABELS[urgency]}
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
