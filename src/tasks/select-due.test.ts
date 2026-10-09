import { describe, expect, test } from "vitest";
import { parseJakartaInputValue } from "../lib/time";
import { selectDueReminders } from "./select-due";
import type { Task } from "./schema";

const createTask = (deadline: string, remind_d1_at: string | null = null, remind_d0_at: string | null = null): Task => {
  return {
    id: "uuid",
    short_id: 1,
    user_id: "user",
    title: "Test",
    urgency: "sedang",
    status: "todo",
    created_at: new Date().toISOString(),
    completed_at: null,
    deadline: parseJakartaInputValue(deadline).toISOString(),
    source: "web",
    remind_d1_at,
    remind_d0_at,
  };
};

describe("selectDueReminders", () => {
  test("Tugas normal (deadline 15:00) H-1", () => {
    const task = createTask("2026-10-10T15:00");
    
    let due = selectDueReminders([task], parseJakartaInputValue("2026-10-09T07:59"));
    expect(due).toHaveLength(0);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-09T08:00"));
    expect(due).toEqual([{ task, type: "H-1" }]);

    const sentTask = { ...task, remind_d1_at: new Date().toISOString() };
    due = selectDueReminders([sentTask], parseJakartaInputValue("2026-10-09T09:00"));
    expect(due).toHaveLength(0);
  });

  test("Tugas normal (deadline 15:00) Hari-H", () => {
    const task = createTask("2026-10-10T15:00");
    
    let due = selectDueReminders([task], parseJakartaInputValue("2026-10-10T07:00"));
    expect(due).toHaveLength(0);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-10T08:00"));
    expect(due).toEqual([{ task, type: "H-0" }]);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-10T15:01"));
    expect(due).toHaveLength(0);
  });

  test("Tugas pagi (deadline < 08:00, contoh 07:00) H-1 ditiadakan", () => {
    const task = createTask("2026-10-10T07:00");
    
    let due = selectDueReminders([task], parseJakartaInputValue("2026-10-09T08:00"));
    expect(due).toHaveLength(0);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-09T20:00"));
    expect(due).toEqual([{ task, type: "H-0" }]);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-10T06:00"));
    expect(due).toEqual([{ task, type: "H-0" }]);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-10T07:01"));
    expect(due).toHaveLength(0);
  });

  test("Tugas dengan deadline tepat 08:00", () => {
    const task = createTask("2026-10-10T08:00");
    
    let due = selectDueReminders([task], parseJakartaInputValue("2026-10-09T08:00"));
    expect(due).toEqual([{ task, type: "H-1" }]);

    due = selectDueReminders([task], parseJakartaInputValue("2026-10-10T08:00"));
    expect(due).toEqual([{ task, type: "H-0" }]);
  });
});
