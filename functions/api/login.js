import { COOKIE, MAX_AGE, configured, json, makeSession, safeEqual } from "./_session.js";

export async function onRequestPost({ request, env }) {
  if (!configured(env)) return json({ error: "not_configured" }, 500);
  let pw = "";
  try { pw = (await request.json()).password || ""; } catch (e) {}
  if (!safeEqual(pw, env.ADMIN_PASSWORD)) {
    await new Promise((r) => setTimeout(r, 1200)); // slow down guessing
    return json({ error: "wrong_password" }, 401);
  }
  const cookie = `${COOKIE}=${await makeSession(env)}; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=${MAX_AGE}`;
  return json({ ok: true }, 200, { "Set-Cookie": cookie });
}
