import { NextResponse } from "next/server";
import { rsvps } from "@/lib/mongodb";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  let body: unknown;
  try { body = await req.json(); } catch { return NextResponse.json({ error: "bad json" }, { status: 400 }); }
  const b = body as { guests?: unknown; message?: unknown; invite?: unknown; lang?: unknown; website?: unknown };

  if (b.website) return NextResponse.json({ ok: true }); // honeypot for bots

  const guests = Array.isArray(b.guests)
    ? b.guests
        .slice(0, 20)
        .map((g) => ({ name: String(g?.name ?? "").trim().slice(0, 80), attending: g?.attending === true }))
        .filter((g) => g.name)
    : [];
  if (!guests.length) return NextResponse.json({ error: "no guests" }, { status: 400 });

  try {
    await (await rsvps()).insertOne({
      guests,
      message: String(b.message ?? "").trim().slice(0, 120),
      invite: b.invite ? String(b.invite).slice(0, 300) : null,
      lang: b.lang === "en" ? "en" : "ar",
      createdAt: new Date(),
      userAgent: req.headers.get("user-agent")?.slice(0, 200),
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: "db error" }, { status: 500 });
  }
}
