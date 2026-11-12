import { NextResponse } from "next/server";
import { COOKIE, checkCredentials, cookieOptions, createToken } from "@/lib/auth";

export async function POST(req: Request) {
  const form = await req.formData();
  const user = String(form.get("username") ?? "");
  const pass = String(form.get("password") ?? "");
  if (!checkCredentials(user, pass)) {
    await new Promise((r) => setTimeout(r, 600)); // slow down guessing
    return NextResponse.redirect(new URL("/admin/login?error=1", req.url), 303);
  }
  const res = NextResponse.redirect(new URL("/admin", req.url), 303);
  res.cookies.set(COOKIE, await createToken(), cookieOptions);
  return res;
}
