import { describe, it, expect } from "vitest";
import { formatDate, isOverdue, sortByPriority } from "@/lib/utils";

describe("formatDate", () => {
  it("returns empty for null", () => {
    expect(formatDate(null)).toBe("");
  });

  it("formats a date", () => {
    const r = formatDate("2026-06-08");
    expect(r).toContain("jun");
  });

  it("accepts Date object", () => {
    const r = formatDate(new Date("2026-06-08"));
    expect(r).toContain("jun");
  });
});

describe("isOverdue", () => {
  it("returns false for null", () => {
    expect(isOverdue(null)).toBe(false);
  });

  it("returns true for past date", () => {
    expect(isOverdue("2020-01-01")).toBe(true);
  });

  it("returns false for future date", () => {
    expect(isOverdue("2099-01-01")).toBe(false);
  });
});

describe("sortByPriority", () => {
  it("sorts alta first, then media, then baja", () => {
    const tasks = [
      { priority: "baja" },
      { priority: "alta" },
      { priority: "media" },
    ];
    const sorted = sortByPriority(tasks);
    expect(sorted[0].priority).toBe("alta");
    expect(sorted[1].priority).toBe("media");
    expect(sorted[2].priority).toBe("baja");
  });

  it("does not mutate original", () => {
    const original = [{ priority: "baja" }, { priority: "alta" }];
    const sorted = sortByPriority(original);
    expect(original[0].priority).toBe("baja");
    expect(sorted[0].priority).toBe("alta");
  });
});
