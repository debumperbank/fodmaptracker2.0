import { describe, expect, it } from "vitest";
import { safeNextPath } from "@/lib/redirect-path";

describe("safeNextPath", () => {
  it("allows an in-app path and rejects off-site targets", () => {
    expect(safeNextPath("/wachtwoord-opnieuw")).toBe("/wachtwoord-opnieuw");
    expect(safeNextPath(null)).toBe("/dashboard");
    expect(safeNextPath("//evil.example")).toBe("/dashboard");
    expect(safeNextPath("https://evil.example")).toBe("/dashboard");
    expect(safeNextPath("/\\evil.example")).toBe("/dashboard");
  });
});
