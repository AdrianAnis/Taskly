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
      <div className="flex h-32 items-center justify-center rounded-xl border border-dashed border-line bg-surface px-6 text-center text-sm text-ink-muted">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <ul className="flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
      {tasks.map((task, index) => (
        <div key={task.id}>
          {index > 0 ? <hr className="border-line" /> : null}
          <TaskItem task={task} />
        </div>
      ))}
    </ul>
  );
}
