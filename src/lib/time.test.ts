import { describe, expect, test } from "vitest";
import { countJakartaDaysBetween, parseJakartaInputValue, toJakartaInputValue } from "./time";

describe("lib/time", () => {
  test("parseJakartaInputValue ke UTC", () => {
    // 2026-10-10T08:00 WIB harusnya jadi 2026-10-10T01:00Z
    const date = parseJakartaInputValue("2026-10-10T08:00");
    expect(date.toISOString()).toBe("2026-10-10T01:00:00.000Z");
  });

  test("toJakartaInputValue dari UTC", () => {
    const date = new Date("2026-10-10T01:00:00.000Z");
    expect(toJakartaInputValue(date)).toBe("2026-10-10T08:00");
  });

  test("countJakartaDaysBetween pada hari yang sama (meski beda waktu)", () => {
    const from = parseJakartaInputValue("2026-10-10T08:00");
    const to = parseJakartaInputValue("2026-10-10T23:00");
    expect(countJakartaDaysBetween(from, to)).toBe(0);
  });

  test("countJakartaDaysBetween beda hari", () => {
    const from = parseJakartaInputValue("2026-10-10T23:00");
    const to = parseJakartaInputValue("2026-10-11T01:00");
    expect(countJakartaDaysBetween(from, to)).toBe(1);
  });
});
