"use client";

import { useOptimistic, useState, useTransition, type JSX } from "react";
import { Badge } from "@/components/badge";
import { Button } from "@/components/button";
import { CheckIcon, ClockIcon, PencilIcon, TrashIcon } from "@/components/icons";
import type { ActionResult } from "@/lib/action-result";
import { deleteTask, setTaskStatus } from "@/tasks/actions";
import type { DeadlineStatus } from "@/tasks/deadline-status";
import { TaskEditor } from "@/tasks/task-editor";
import type { TaskView } from "@/tasks/task-view";
import { URGENCY_BADGE_CLASSES, URGENCY_DOT_CLASSES, URGENCY_LABELS } from "@/tasks/urgency-style";

type ItemMode = "view" | "edit" | "confirm-delete";

const DEADLINE_TONE_CLASSES: Record<DeadlineStatus, string> = {
  none: "text-ink-subtle",
  upcoming: "text-ink-muted",
  today: "bg-warning-soft text-warning",
  overdue: "bg-danger-soft text-danger",
};

const DEADLINE_PREFIX: Record<DeadlineStatus, string | null> = {
  none: null,
  upcoming: null,
  today: "Hari ini ·",
  overdue: "Lewat ·",
};

export function TaskItem({ task }: { task: TaskView }): JSX.Element {
  const [mode, setMode] = useState<ItemMode>("view");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [isDone, setOptimisticDone] = useOptimistic(task.isDone);

  function runAction(action: () => Promise<ActionResult<null>>, onStart?: () => void): void {
    startTransition(async () => {
      onStart?.();
      const result = await action();
      setError(result.ok ? null : result.error);
    });
  }

  function toggleDone(): void {
    const nextStatus = isDone ? "todo" : "done";
    runAction(() => setTaskStatus(task.id, nextStatus), () => setOptimisticDone(!isDone));
  }

  if (mode === "edit") return <TaskEditor task={task} onClose={() => setMode("view")} />;

  return (
    <li className={`group animate-enter flex flex-wrap items-start gap-x-2 gap-y-1 px-2 py-2 transition-opacity duration-200 sm:flex-nowrap sm:px-3 ${isPending ? "opacity-60" : ""}`}>
      <StatusToggle title={task.title} isDone={isDone} isDisabled={isPending} onToggle={toggleDone} />
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 py-2.5">
        <TaskSummary task={task} isDone={isDone} />
        {error === null ? null : (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}
      </div>
      {mode === "confirm-delete" ? (
        <DeleteConfirm
          isPending={isPending}
          onCancel={() => setMode("view")}
          onConfirm={() => runAction(() => deleteTask(task.id))}
        />
      ) : (
        <ItemActions title={task.title} isDisabled={isPending} onEdit={() => setMode("edit")} onDelete={() => setMode("confirm-delete")} />
      )}
    </li>
  );
}

type StatusToggleProps = {
  title: string;
  isDone: boolean;
  isDisabled: boolean;
  onToggle: () => void;
};

function StatusToggle({ title, isDone, isDisabled, onToggle }: StatusToggleProps): JSX.Element {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={isDone}
      aria-label={isDone ? `Kembalikan ke aktif: ${title}` : `Tandai selesai: ${title}`}
      onClick={onToggle}
      disabled={isDisabled}
      className="group/toggle flex size-11 shrink-0 items-center justify-center rounded-full outline-none focus-visible:ring-[3px] focus-visible:ring-ring disabled:cursor-not-allowed"
    >
      <span
        className={`flex size-5 items-center justify-center rounded-full border-[1.5px] transition-all duration-200 ${
          isDone
            ? "scale-100 border-accent bg-accent text-on-accent"
            : "border-line-strong text-transparent group-hover/toggle:border-ink-muted group-hover/toggle:text-ink-muted"
        }`}
      >
        <CheckIcon className="size-3" strokeWidth={2.6} />
      </span>
    </button>
  );
}

function TaskSummary({ task, isDone }: { task: TaskView; isDone: boolean }): JSX.Element {
  const prefix = DEADLINE_PREFIX[task.deadlineStatus];
  return (
    <>
      <p className={`text-[15px] leading-snug break-words transition-colors duration-200 ${isDone ? "text-ink-subtle line-through" : "text-ink"}`}>
        {task.title}
      </p>
      <div className="flex flex-wrap items-center gap-2">
        <Badge className={URGENCY_BADGE_CLASSES[task.urgency]}>
          <span aria-hidden="true" className={`size-1.5 rounded-full ${URGENCY_DOT_CLASSES[task.urgency]}`} />
          {URGENCY_LABELS[task.urgency]}
        </Badge>
        {task.deadlineLabel === null ? null : (
          <Badge className={DEADLINE_TONE_CLASSES[task.deadlineStatus]}>
            <ClockIcon className="size-3.5" />
            {prefix === null ? null : <span className="font-semibold">{prefix}</span>}
            <time>{task.deadlineLabel}</time>
          </Badge>
        )}
        <span className="text-xs text-ink-subtle tabular-nums">#{task.shortId}</span>
      </div>
    </>
  );
}

type ItemActionsProps = {
  title: string;
  isDisabled: boolean;
  onEdit: () => void;
  onDelete: () => void;
};

function ItemActions({ title, isDisabled, onEdit, onDelete }: ItemActionsProps): JSX.Element {
  return (
    <div className="flex shrink-0 items-center opacity-100 transition-opacity duration-150 sm:opacity-0 sm:group-focus-within:opacity-100 sm:group-hover:opacity-100">
      <Button variant="ghost" size="icon" aria-label={`Ubah: ${title}`} onClick={onEdit} disabled={isDisabled}>
        <PencilIcon />
      </Button>
      <Button variant="ghost" size="icon" aria-label={`Hapus: ${title}`} onClick={onDelete} disabled={isDisabled} className="hover:text-danger">
        <TrashIcon />
      </Button>
    </div>
  );
}

type DeleteConfirmProps = {
  isPending: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

function DeleteConfirm({ isPending, onCancel, onConfirm }: DeleteConfirmProps): JSX.Element {
  return (
    <div className="animate-enter flex w-full shrink-0 items-center justify-end gap-1 pb-1 sm:w-auto sm:pb-0" role="group" aria-label="Konfirmasi hapus">
      <Button variant="ghost" onClick={onCancel} disabled={isPending}>
        Batal
      </Button>
      <Button variant="danger" onClick={onConfirm} isLoading={isPending}>
        Hapus
      </Button>
    </div>
  );
}
