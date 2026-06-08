import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateCreateTaskInput } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const { searchParams } = request.nextUrl;
  const listId = searchParams.get("listId");
  const priority = searchParams.get("priority");
  const completed = searchParams.get("completed");

  const where: Record<string, unknown> = {};
  if (listId) where.listId = listId;
  if (priority) where.priority = priority;
  if (completed === "true") where.completed = true;
  if (completed === "false") where.completed = false;

  const tasks = await prisma.task.findMany({
    where,
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(tasks);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateCreateTaskInput(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const task = await prisma.task.create({
    data: {
      listId: parsed.data.listId,
      title: parsed.data.title,
      description: parsed.data.description ?? "",
      dueDate: parsed.data.dueDate ? new Date(parsed.data.dueDate) : null,
      priority: parsed.data.priority ?? "media",
      categories: parsed.data.categories ?? [],
    },
  });
  return NextResponse.json(task, { status: 201 });
}
