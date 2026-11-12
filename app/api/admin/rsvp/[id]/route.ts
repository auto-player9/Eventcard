import { NextResponse } from "next/server";
import { ObjectId } from "mongodb";
import { rsvps } from "@/lib/mongodb";

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!ObjectId.isValid(id)) return NextResponse.json({ error: "bad id" }, { status: 400 });
  await (await rsvps()).deleteOne({ _id: new ObjectId(id) });
  return NextResponse.json({ ok: true });
}
