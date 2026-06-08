import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateUpdateListInput } from "@/lib/validators";

export async function PATCH(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const body = await _request.json();
  const parsed = validateUpdateListInput(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  try {
    const list = await prisma.list.update({
      where: { id },
      data: parsed.data,
    });
    return NextResponse.json(list);
  } catch {
    return NextResponse.json({ error: "Lista no encontrada" }, { status: 404 });
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    await prisma.list.delete({ where: { id } });
    return NextResponse.json({ message: "Lista eliminada" });
  } catch {
    return NextResponse.json({ error: "Lista no encontrada" }, { status: 404 });
  }
}
