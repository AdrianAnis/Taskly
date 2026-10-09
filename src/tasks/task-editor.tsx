"use client";

import type { JSX } from "react";
import { updateTask } from "@/tasks/actions";
import { TaskForm } from "@/tasks/task-form";
import type { TaskView } from "@/tasks/task-view";

type TaskEditorProps = {
  task: TaskView;
  onClose: () => void;
};

export function TaskEditor({ task, onClose }: TaskEditorProps): JSX.Element {
  return (
    <li className="animate-enter bg-surface-muted/60 px-4 py-5 sm:px-5">
      <TaskForm
        idPrefix={`edit-${task.id}`}
        submitLabel="Simpan"
        defaults={{ title: task.title, urgency: task.urgency, deadline: task.deadlineInput }}
        onSubmit={(formData) => updateTask(task.id, formData)}
        onSuccess={onClose}
        onCancel={onClose}
      />
    </li>
  );
}
