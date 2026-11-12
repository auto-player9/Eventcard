import { rsvps } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

const esc = (v: string) => `"${v.replace(/"/g, '""')}"`;

export async function GET() {
  const list = await (await rsvps()).find().sort({ createdAt: -1 }).toArray();
  const rows = [["Date", "Name", "Attending", "Message", "Invite link names"]];
  for (const r of list)
    for (const g of r.guests)
      rows.push([r.createdAt.toISOString(), g.name, g.attending ? "Yes" : "No", r.message, r.invite ?? ""]);
  const csv = "﻿" + rows.map((r) => r.map((c) => esc(String(c))).join(",")).join("\r\n");
  return new Response(csv, {
    headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": 'attachment; filename="rsvps.csv"' },
  });
}
