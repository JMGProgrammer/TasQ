import { describe, it, expect } from "vitest";
import {
  validateString,
  validateUuid,
  validatePriority,
  validateColor,
  validateDate,
  validateCategories,
  validateListInput,
  validateUpdateListInput,
  validateCreateTaskInput,
  validateUpdateTaskInput,
} from "@/lib/validators";

describe("validateString", () => {
  it("rejects non-string", () => {
    expect(validateString(123, "title", 1, 200).success).toBe(false);
  });

  it("rejects too short", () => {
    expect(validateString("", "name", 1, 100).success).toBe(false);
  });

  it("rejects too long", () => {
    expect(validateString("x".repeat(101), "name", 1, 100).success).toBe(false);
  });

  it("accepts valid string", () => {
    const r = validateString("hello", "name", 1, 100);
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBe("hello");
  });
});

describe("validateUuid", () => {
  it("rejects non-string", () => {
    expect(validateUuid(123, "id").success).toBe(false);
  });

  it("rejects invalid uuid", () => {
    expect(validateUuid("not-a-uuid", "id").success).toBe(false);
  });

  it("accepts valid uuid", () => {
    const r = validateUuid("550e8400-e29b-41d4-a716-446655440000", "id");
    expect(r.success).toBe(true);
  });
});

describe("validatePriority", () => {
  it("rejects invalid priority", () => {
    expect(validatePriority("urgente", "priority").success).toBe(false);
  });

  it.each(["alta", "media", "baja"])("accepts %s", (p) => {
    expect(validatePriority(p, "priority").success).toBe(true);
  });
});

describe("validateColor", () => {
  it("rejects invalid hex", () => {
    expect(validateColor("zzz", "color").success).toBe(false);
  });

  it("accepts valid hex", () => {
    expect(validateColor("#FF5733", "color").success).toBe(true);
  });
});

describe("validateDate", () => {
  it("accepts null", () => {
    const r = validateDate(null, "dueDate");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeNull();
  });

  it("accepts undefined", () => {
    const r = validateDate(undefined, "dueDate");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toBeNull();
  });

  it("rejects invalid date string", () => {
    expect(validateDate("not-a-date", "dueDate").success).toBe(false);
  });

  it("accepts valid ISO date", () => {
    expect(validateDate("2026-06-15", "dueDate").success).toBe(true);
  });
});

describe("validateCategories", () => {
  it("rejects non-array", () => {
    expect(validateCategories("string", "cats").success).toBe(false);
  });

  it("rejects too many items", () => {
    expect(validateCategories(Array.from({ length: 11 }, (_, i) => `c${i}`), "cats").success).toBe(false);
  });

  it("rejects non-string item", () => {
    expect(validateCategories(["ok", 123], "cats").success).toBe(false);
  });

  it("accepts valid array", () => {
    const r = validateCategories(["frontend", "bug"], "cats");
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toEqual(["frontend", "bug"]);
  });
});

describe("validateListInput", () => {
  it("rejects missing name", () => {
    const r = validateListInput({});
    expect(r.success).toBe(false);
  });

  it("accepts valid input", () => {
    const r = validateListInput({ name: "Work" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data).toEqual({ name: "Work", color: "#3B82F6" });
  });

  it("accepts with custom color", () => {
    const r = validateListInput({ name: "Personal", color: "#10B981" });
    expect(r.success).toBe(true);
    if (r.success) expect(r.data.color).toBe("#10B981");
  });
});

describe("validateUpdateListInput", () => {
  it("rejects empty body", () => {
    expect(validateUpdateListInput({}).success).toBe(false);
  });

  it("accepts partial update", () => {
    const r = validateUpdateListInput({ name: "New name" });
    expect(r.success).toBe(true);
  });
});

describe("validateCreateTaskInput", () => {
  it("rejects missing listId", () => {
    expect(validateCreateTaskInput({ title: "Task" }).success).toBe(false);
  });

  it("rejects missing title", () => {
    expect(
      validateCreateTaskInput({ listId: "550e8400-e29b-41d4-a716-446655440000" }).success,
    ).toBe(false);
  });

  it("accepts valid task", () => {
    const r = validateCreateTaskInput({
      listId: "550e8400-e29b-41d4-a716-446655440000",
      title: "My task",
    });
    expect(r.success).toBe(true);
  });

  it("accepts task with all fields", () => {
    const r = validateCreateTaskInput({
      listId: "550e8400-e29b-41d4-a716-446655440000",
      title: "Full task",
      description: "Desc",
      dueDate: "2026-07-01",
      priority: "alta",
      categories: ["dev"],
    });
    expect(r.success).toBe(true);
  });
});

describe("validateUpdateTaskInput", () => {
  it("rejects empty body", () => {
    expect(validateUpdateTaskInput({}).success).toBe(false);
  });

  it("rejects invalid completed", () => {
    expect(
      validateUpdateTaskInput({ completed: "yes" }).success,
    ).toBe(false);
  });

  it("accepts toggle completed", () => {
    const r = validateUpdateTaskInput({ completed: true });
    expect(r.success).toBe(true);
  });
});
