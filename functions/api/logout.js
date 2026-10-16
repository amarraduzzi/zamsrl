import { COOKIE, json } from "./_session.js";

export async function onRequestPost() {
  return json({ ok: true }, 200, { "Set-Cookie": `${COOKIE}=; HttpOnly; Secure; SameSite=Strict; Path=/; Max-Age=0` });
}
