import { countJakartaDaysBetween, toJakartaInputValue } from "../lib/time";
import type { Task } from "./schema";

export type DueReminder = {
  task: Task;
  type: "H-1" | "H-0";
};

export function selectDueReminders(tasks: readonly Task[], currentTime: Date): DueReminder[] {
  const due: DueReminder[] = [];
  const currentStr = toJakartaInputValue(currentTime);
  const currentHourMin = currentStr.substring(11, 16);

  for (const task of tasks) {
    if (task.status !== "todo" || !task.deadline) continue;

    const deadlineTime = new Date(task.deadline);
    if (currentTime.getTime() > deadlineTime.getTime()) {
      continue;
    }

    const deadlineStr = toJakartaInputValue(deadlineTime);
    const deadlineHourMin = deadlineStr.substring(11, 16);
    const isEarlyMorningDeadline = deadlineHourMin < "08:00";
    const daysBetween = countJakartaDaysBetween(currentTime, deadlineTime);

    if (daysBetween === 0) {
      if (isEarlyMorningDeadline) {
        if (task.remind_d0_at === null) {
          due.push({ task, type: "H-0" });
        }
      } else {
        if (currentHourMin >= "08:00" && task.remind_d0_at === null) {
          due.push({ task, type: "H-0" });
        }
      }
    } else if (daysBetween === 1) {
      if (isEarlyMorningDeadline) {
        if (currentHourMin >= "20:00" && task.remind_d0_at === null) {
          due.push({ task, type: "H-0" });
        }
      } else {
        if (currentHourMin >= "08:00" && task.remind_d1_at === null) {
          due.push({ task, type: "H-1" });
        }
      }
    }
  }

  return due;
}
