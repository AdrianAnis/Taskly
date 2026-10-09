import { formatJakartaDateTime, toJakartaInputValue } from "@/lib/time";
import { getDeadlineStatus, type DeadlineStatus } from "@/tasks/deadline-status";
import type { Task, Urgency } from "@/tasks/schema";

export type TaskView = {
  id: string;
  shortId: number;
  title: string;
  urgency: Urgency;
  isDone: boolean;
  deadlineLabel: string | null;
  deadlineInput: string;
  deadlineStatus: DeadlineStatus;
};

export function toTaskView(task: Task, currentTime: Date): TaskView {
  const deadlineDate = task.deadline === null ? null : new Date(task.deadline);
  const isDone = task.status === "done";
  return {
    id: task.id,
    shortId: task.short_id,
    title: task.title,
    urgency: task.urgency,
    isDone,
    deadlineLabel: deadlineDate === null ? null : formatJakartaDateTime(deadlineDate),
    deadlineInput: deadlineDate === null ? "" : toJakartaInputValue(deadlineDate),
    deadlineStatus: isDone ? "none" : getDeadlineStatus(task.deadline, currentTime),
  };
}
