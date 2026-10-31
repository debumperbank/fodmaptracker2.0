import { describe, expect, it } from "vitest";
import { amsterdamDate, isHalloweenToday } from "@/lib/seasonal";

describe("temporary Halloween theme", () => {
  it("is active throughout 31 October in Amsterdam", () => {
    expect(amsterdamDate(new Date("2026-10-30T23:00:00Z"))).toBe("2026-10-31");
    expect(isHalloweenToday(new Date("2026-10-31T12:00:00Z"))).toBe(true);
  });

  it("turns off at Amsterdam midnight", () => {
    expect(isHalloweenToday(new Date("2026-10-31T23:00:00Z"))).toBe(false);
  });
});
