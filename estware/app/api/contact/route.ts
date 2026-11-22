import { NextResponse } from "next/server";
import { CONTACT_EMAIL, NEEDS } from "@/lib/site";

const clean = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : "");
const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

export async function POST(req: Request) {
  let data: Record<string, unknown>;
  try {
    data = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request" }, { status: 400 });
  }

  const name = clean(data.name, 200);
  const email = clean(data.email, 200);
  const need = clean(data.need, 100);
  const message = clean(data.message, 5000);

  if (!name || !message || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !NEEDS.includes(need)) {
    return NextResponse.json({ error: "Please fill in every field." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // No delivery configured: the browser falls back to opening the visitor's email app.
    return NextResponse.json({ error: "Email delivery is not configured" }, { status: 501 });
  }

  const to = process.env.CONTACT_TO || CONTACT_EMAIL;
  const from = process.env.CONTACT_FROM || "Estware website <onboarding@resend.dev>";
  const text = `Name: ${name}\nEmail: ${email}\nNeed: ${need}\n\n${message}`;

  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    body: JSON.stringify({
      from,
      to: [to],
      reply_to: email,
      subject: `Project enquiry: ${need}`,
      text,
      html: `<pre style="font:14px/1.5 sans-serif;white-space:pre-wrap">${escapeHtml(text)}</pre>`,
    }),
  });

  if (!res.ok) {
    console.error("Resend error", res.status, await res.text().catch(() => ""));
    return NextResponse.json({ error: "Could not send" }, { status: 502 });
  }
  return NextResponse.json({ ok: true });
}
