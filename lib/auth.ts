// Minimal signed-cookie session. Uses Web Crypto so it also runs in middleware (edge runtime).
export const COOKIE = "admin_session";
const MAX_AGE = 60 * 60 * 24 * 7; // 7 days

function secret() {
  const s = process.env.ADMIN_SECRET;
  if (!s) throw new Error("ADMIN_SECRET is not set");
  return s;
}

const enc = new TextEncoder();
const b64 = (buf: ArrayBuffer) =>
  btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

async function sign(data: string) {
  const key = await crypto.subtle.importKey("raw", enc.encode(secret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return b64(await crypto.subtle.sign("HMAC", key, enc.encode(data)));
}

function safeEqual(a: string, b: string) {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function createToken() {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  const payload = `admin.${exp}`;
  return `${payload}.${await sign(payload)}`;
}

export async function verifyToken(token?: string | null) {
  if (!token) return false;
  const i = token.lastIndexOf(".");
  if (i < 0) return false;
  const payload = token.slice(0, i);
  const exp = Number(payload.split(".")[1]);
  if (!exp || exp < Date.now() / 1000) return false;
  try {
    return safeEqual(token.slice(i + 1), await sign(payload));
  } catch {
    return false;
  }
}

export function checkCredentials(user: string, pass: string) {
  const U = process.env.ADMIN_USERNAME || "admin";
  const P = process.env.ADMIN_PASSWORD;
  if (!P) return false;
  return safeEqual(user, U) && safeEqual(pass, P);
}

export const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
  maxAge: MAX_AGE,
};
