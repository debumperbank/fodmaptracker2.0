import { describe, expect, it } from "vitest";
import { addCalendarDays, formatCalendarDate, mondayOfWeek, safeTimeZone, weekDates, zonedCalendarDate } from "@/lib/dates";

describe("week dates in Europe/Amsterdam", () => {
  it("uses the Amsterdam calendar date just after midnight, not the UTC date", () => {
    const winterMonday = new Date("2026-03-01T23:30:00.000Z");
    expect(zonedCalendarDate("Europe/Amsterdam", winterMonday)).toBe("2026-03-02");
    expect(mondayOfWeek(zonedCalendarDate("Europe/Amsterdam", winterMonday))).toBe("2026-03-02");

    const summerMonday = new Date("2026-10-04T22:30:00.000Z");
    expect(zonedCalendarDate("Europe/Amsterdam", summerMonday)).toBe("2026-10-05");
    expect(mondayOfWeek(zonedCalendarDate("Europe/Amsterdam", summerMonday))).toBe("2026-10-05");
  });

  it("starts the week on Monday for a Sunday date", () => {
    expect(mondayOfWeek("2026-03-01")).toBe("2026-02-23");
    expect(weekDates("2026-02-23")).toEqual(["2026-02-23", "2026-02-24", "2026-02-25", "2026-02-26", "2026-02-27", "2026-02-28", "2026-03-01"]);
  });

  it("adds days across a month boundary", () => {
    expect(addCalendarDays("2026-10-30", 3)).toBe("2026-11-02");
  });

  it("falls back to Europe/Amsterdam for an unknown timezone and keeps the calendar label", () => {
    expect(safeTimeZone("Not/AZone")).toBe("Europe/Amsterdam");
    expect(safeTimeZone("Europe/Brussels")).toBe("Europe/Brussels");
    expect(formatCalendarDate("2026-10-30", "Europe/Amsterdam", { day: "numeric", month: "long" })).toContain("30");
  });
});
