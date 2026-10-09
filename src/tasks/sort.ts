import type { Task, Urgency } from "@/tasks/schema";

type SortableTask = Pick<Task, "urgency" | "deadline" | "created_at">;

const URGENCY_RANK: Record<Urgency, number> = {
  banget: 0,
  sedang: 1,
  ringan: 2,
};

function compareDeadlines(first: string | null, second: string | null): number {
  if (first === second) return 0;
  if (first === null) return 1;
  if (second === null) return -1;
  return Date.parse(first) - Date.parse(second);
}

export function compareTasks(first: SortableTask, second: SortableTask): number {
  const byUrgency = URGENCY_RANK[first.urgency] - URGENCY_RANK[second.urgency];
  if (byUrgency !== 0) return byUrgency;
  const byDeadline = compareDeadlines(first.deadline, second.deadline);
  if (byDeadline !== 0) return byDeadline;
  return Date.parse(first.created_at) - Date.parse(second.created_at);
}

export function sortTasks<Item extends SortableTask>(tasks: readonly Item[]): Item[] {
  return [...tasks].sort(compareTasks);
}
