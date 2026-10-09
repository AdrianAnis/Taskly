import type { JSX } from "react";
import { TaskItem } from "@/tasks/task-item";
import type { TaskView } from "@/tasks/task-view";

type TaskListProps = {
  tasks: readonly TaskView[];
  emptyMessage: string;
};

export function TaskList({ tasks, emptyMessage }: TaskListProps): JSX.Element {
  if (tasks.length === 0) {
    return (
      <div className="flex h-28 items-center justify-center rounded-2xl border border-dashed border-line bg-surface px-6 text-center text-sm text-ink-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col divide-y divide-line overflow-hidden rounded-2xl border border-line bg-surface shadow-card">
      {tasks.map((task) => (
        <TaskItem key={task.id} task={task} />
      ))}
    </ul>
  );
}
