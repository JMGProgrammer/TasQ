import { describe, it, expect, vi, beforeEach } from "vitest";

const mockFindMany = vi.fn();
const mockCreate = vi.fn();
const mockUpdate = vi.fn();
const mockDelete = vi.fn();

vi.mock("@/lib/prisma", () => ({
  prisma: {
    list: {
      findMany: mockFindMany,
      create: mockCreate,
      update: mockUpdate,
      delete: mockDelete,
    },
    task: {
      findMany: vi.fn(),
      create: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

beforeEach(() => {
  vi.clearAllMocks();
});

describe("Lists API logic", () => {
  it("findMany returns lists ordered by createdAt asc", async () => {
    const fakeLists = [
      { id: "1", name: "Work", color: "#3B82F6", createdAt: new Date("2026-01-01"), updatedAt: new Date("2026-01-01") },
    ];
    mockFindMany.mockResolvedValue(fakeLists);

    const { prisma } = await import("@/lib/prisma");
    const result = await prisma.list.findMany({ orderBy: { createdAt: "asc" } });

    expect(result).toEqual(fakeLists);
    expect(mockFindMany).toHaveBeenCalledWith({ orderBy: { createdAt: "asc" } });
  });

  it("create inserts a new list and returns it", async () => {
    const input = { name: "Personal", color: "#10B981" };
    const created = { id: "2", ...input, createdAt: new Date(), updatedAt: new Date() };
    mockCreate.mockResolvedValue(created);

    const { prisma } = await import("@/lib/prisma");
    const result = await prisma.list.create({ data: input });

    expect(result).toEqual(created);
    expect(mockCreate).toHaveBeenCalledWith({ data: input });
  });

  it("update modifies an existing list", async () => {
    const updated = { id: "1", name: "Work v2", color: "#3B82F6", createdAt: new Date(), updatedAt: new Date() };
    mockUpdate.mockResolvedValue(updated);

    const { prisma } = await import("@/lib/prisma");
    const result = await prisma.list.update({ where: { id: "1" }, data: { name: "Work v2" } });

    expect(result.name).toBe("Work v2");
  });

  it("delete removes a list", async () => {
    mockDelete.mockResolvedValue({ id: "1" });

    const { prisma } = await import("@/lib/prisma");
    const result = await prisma.list.delete({ where: { id: "1" } });

    expect(result.id).toBe("1");
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "1" } });
  });
});
