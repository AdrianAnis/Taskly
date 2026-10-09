"use client";

import { useState, useTransition, type FormEvent, type JSX } from "react";
import { Button } from "@/components/button";
import { TextField } from "@/components/input";
import type { ActionResult } from "@/lib/action-result";
import { DEFAULT_URGENCY, TITLE_MAX_LENGTH, type Urgency } from "@/tasks/schema";
import { UrgencyPicker } from "@/tasks/urgency-picker";

export type TaskFormDefaults = {
  title: string;
  urgency: Urgency;
  deadline: string;
};

type TaskFormProps = {
  idPrefix: string;
  submitLabel: string;
  defaults?: TaskFormDefaults;
  onSubmit: (formData: FormData) => Promise<ActionResult<null>>;
  onSuccess?: () => void;
  onCancel?: () => void;
};

export function TaskForm({ idPrefix, submitLabel, defaults, onSubmit, onSuccess, onCancel }: TaskFormProps): JSX.Element {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    startTransition(async () => {
      const result = await onSubmit(formData);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setError(null);
      if (defaults === undefined) form.reset();
      onSuccess?.();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      <TextField
        id={`${idPrefix}-title`}
        name="title"
        label="Nama tugas"
        isLabelHidden={defaults === undefined}
        placeholder="Tambah tugas, mis. Laprak basdat"
        defaultValue={defaults?.title}
        maxLength={TITLE_MAX_LENGTH}
        required
        autoComplete="off"
        disabled={isPending}
      />
      <div className="grid gap-4 sm:grid-cols-[1fr_1fr]">
        <UrgencyPicker idPrefix={idPrefix} defaultValue={defaults?.urgency ?? DEFAULT_URGENCY} isDisabled={isPending} />
        <TextField
          id={`${idPrefix}-deadline`}
          name="deadline"
          type="datetime-local"
          label="Deadline (WIB, opsional)"
          defaultValue={defaults?.deadline}
          disabled={isPending}
        />
      </div>
      <TaskFormFooter error={error} submitLabel={submitLabel} isPending={isPending} onCancel={onCancel} />
    </form>
  );
}

type TaskFormFooterProps = {
  error: string | null;
  submitLabel: string;
  isPending: boolean;
  onCancel?: () => void;
};

function TaskFormFooter({ error, submitLabel, isPending, onCancel }: TaskFormFooterProps): JSX.Element {
  return (
    <div className="flex flex-col-reverse gap-3 sm:flex-row sm:items-center sm:justify-between">
      <p role="alert" aria-live="polite" className="min-h-5 text-sm text-danger">
        {error}
      </p>
      <div className="flex gap-2 sm:justify-end">
        {onCancel === undefined ? null : (
          <Button variant="ghost" onClick={onCancel} disabled={isPending} className="flex-1 sm:flex-none">
            Batal
          </Button>
        )}
        <Button type="submit" isLoading={isPending} className="flex-1 sm:flex-none">
          {submitLabel}
        </Button>
      </div>
    </div>
  );
}
