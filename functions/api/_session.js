// Shared helpers for the CMS login. Env vars (Cloudflare Pages > Settings > Variables and Secrets):
//   GITHUB_TOKEN    fine-grained token, only repo amarraduzzi/zamsrl, Contents: read and write (secret)
//   ADMIN_PASSWORD  password the client uses on /admin (secret)
const enc = new TextEncoder();
const hex = (buf) => [...new Uint8Array(buf)].map((b) => b.toString(16).padStart(2, "0")).join("");
export const COOKIE = "zam_admin";
export const MAX_AGE = 60 * 60 * 24 * 30; // 30 days

async function hmac(env, msg) {
  // Changing the password or the token invalidates every existing session.
  const key = await crypto.subtle.importKey("raw", enc.encode(env.ADMIN_PASSWORD + "|" + env.GITHUB_TOKEN),
    { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  return hex(await crypto.subtle.sign("HMAC", key, enc.encode(msg)));
}

export function safeEqual(a, b) {
  a = enc.encode(String(a)); b = enc.encode(String(b));
  let diff = a.length ^ b.length;
  for (let i = 0; i < Math.max(a.length, b.length); i++) diff |= (a[i] || 0) ^ (b[i] || 0);
  return diff === 0;
}

export async function makeSession(env) {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE;
  return exp + "." + (await hmac(env, "zam-cms:" + exp));
}

export async function validSession(request, env) {
  const m = (request.headers.get("Cookie") || "").match(new RegExp("(?:^|;\\s*)" + COOKIE + "=(\\d+)\\.([0-9a-f]{64})"));
  if (!m || +m[1] < Date.now() / 1000) return false;
  return safeEqual(m[2], await hmac(env, "zam-cms:" + m[1]));
}

export const configured = (env) => !!(env.GITHUB_TOKEN && env.ADMIN_PASSWORD);

export const json = (body, status = 200, headers = {}) =>
  new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store", ...headers } });
