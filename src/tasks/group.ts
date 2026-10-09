import { formatJakartaLongDate, toJakartaDateKey } from "@/lib/time";
import type { Task } from "@/tasks/schema";
import { sortTasks } from "@/tasks/sort";
import { toTaskView, type TaskView } from "@/tasks/task-view";

export type TaskGroup = {
  key: string;
  heading: string;
  isOverdue: boolean;
  tasks: TaskView[];
};

const NO_DEADLINE_KEY = "no-deadline";

export function groupTasksByDate(tasks: readonly Task[], currentTime: Date): TaskGroup[] {
  const todayKey = toJakartaDateKey(currentTime);
  const groups = new Map<string, TaskGroup>();

  for (const task of sortTasks(tasks)) {
    const deadline = task.deadline === null ? null : new Date(task.deadline);
    const key = deadline === null ? NO_DEADLINE_KEY : toJakartaDateKey(deadline);
    let group = groups.get(key);
    if (group === undefined) {
      group = {
        key,
        heading: deadline === null ? "Tanpa deadline" : formatJakartaLongDate(deadline, currentTime),
        isOverdue: deadline !== null && key < todayKey,
        tasks: [],
      };
      groups.set(key, group);
    }
    group.tasks.push(toTaskView(task, currentTime));
  }

  return [...groups.values()].sort((first, second) => {
    if (first.key === NO_DEADLINE_KEY) return 1;
    if (second.key === NO_DEADLINE_KEY) return -1;
    return first.key.localeCompare(second.key);
  });
}
