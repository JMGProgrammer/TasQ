import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { validateListInput } from "@/lib/validators";

export async function GET() {
  const lists = await prisma.list.findMany({ orderBy: { createdAt: "asc" } });
  return NextResponse.json(lists);
}

export async function POST(request: Request) {
  const body = await request.json();
  const parsed = validateListInput(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error }, { status: 400 });
  }

  const list = await prisma.list.create({ data: parsed.data });
  return NextResponse.json(list, { status: 201 });
}
