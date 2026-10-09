import { describe, expect, test } from "vitest";
import { compareTasks } from "./sort";
import type { Task } from "./schema";

describe("tasks/sort", () => {
  test("urgency banget > sedang > ringan", () => {
    const a = { urgency: "ringan", deadline: null, created_at: "2026-01-01" } as Task;
    const b = { urgency: "banget", deadline: null, created_at: "2026-01-01" } as Task;
    expect(compareTasks(a, b)).toBeGreaterThan(0);
    expect(compareTasks(b, a)).toBeLessThan(0);
  });

  test("urgency sama, deadline ada > deadline kosong", () => {
    const a = { urgency: "sedang", deadline: null, created_at: "2026-01-01" } as Task;
    const b = { urgency: "sedang", deadline: "2026-10-10", created_at: "2026-01-01" } as Task;
    expect(compareTasks(a, b)).toBeGreaterThan(0);
    expect(compareTasks(b, a)).toBeLessThan(0);
  });

  test("urgency sama, deadline ada diurutkan dari yang terdekat", () => {
    const a = { urgency: "sedang", deadline: "2026-10-15", created_at: "2026-01-01" } as Task;
    const b = { urgency: "sedang", deadline: "2026-10-10", created_at: "2026-01-01" } as Task;
    expect(compareTasks(a, b)).toBeGreaterThan(0);
    expect(compareTasks(b, a)).toBeLessThan(0);
  });

  test("urgency sama, deadline sama, diurutkan dari waktu buat terlama", () => {
    const a = { urgency: "sedang", deadline: "2026-10-10", created_at: "2026-01-02" } as Task;
    const b = { urgency: "sedang", deadline: "2026-10-10", created_at: "2026-01-01" } as Task;
    expect(compareTasks(a, b)).toBeGreaterThan(0);
    expect(compareTasks(b, a)).toBeLessThan(0);
  });
});
