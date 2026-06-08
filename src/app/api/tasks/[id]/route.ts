import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUpdateTaskInput } from "@/lib/validators";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await _request.json();
  const parsed = validateUpdateTaskInput(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const data: Record<string, unknown> = { ...parsed.data };
  if (data.dueDate !== undefined) {
    data.dueDate = data.dueDate ? new Date(data.dueDate as string) : null;
  }

  try {
    const task = await prisma.task.update({ where: { id }, data });
    return NextResponse.json(task);
  } catch {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.task.delete({ where: { id } });
    return NextResponse.json({ message: "Tarea eliminada" });
  } catch {
    return NextResponse.json({ error: "Tarea no encontrada" }, { status: 404 });
  }
}
