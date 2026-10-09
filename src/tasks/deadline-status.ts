import { toJakartaDateKey } from "@/lib/time";

export type DeadlineStatus = "none" | "overdue" | "today" | "upcoming";

export function getDeadlineStatus(deadline: string | null, currentTime: Date): DeadlineStatus {
  if (deadline === null) return "none";
  const deadlineDate = new Date(deadline);
  if (deadlineDate.getTime() < currentTime.getTime()) return "overdue";
  if (toJakartaDateKey(deadlineDate) === toJakartaDateKey(currentTime)) return "today";
  return "upcoming";
}
