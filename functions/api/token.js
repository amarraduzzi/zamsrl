// Gives the CMS its GitHub key, but only to someone signed in through Cloudflare Access.
// Env vars (Cloudflare Pages > Settings > Variables and Secrets):
//   GITHUB_TOKEN  fine-grained token, only repo amarraduzzi/zamsrl, Contents: read and write (secret)
//   ACCESS_TEAM   Zero Trust team name, e.g. "amplify" for amplify.cloudflareaccess.com
//   ACCESS_AUD    Application Audience (AUD) tag of the Access app (comma-separated if several)
let certCache = { at: 0, keys: [] };

const b64url = (s) => {
  s = s.replace(/-/g, "+").replace(/_/g, "/");
  while (s.length % 4) s += "=";
  return Uint8Array.from(atob(s), (c) => c.charCodeAt(0));
};

async function getKeys(team) {
  if (Date.now() - certCache.at < 3600e3 && certCache.keys.length) return certCache.keys;
  const res = await fetch(`https://${team}.cloudflareaccess.com/cdn-cgi/access/certs`);
  const { keys } = await res.json();
  certCache = { at: Date.now(), keys };
  return keys;
}

async function verify(jwt, env) {
  const [h, p, sig] = (jwt || "").split(".");
  if (!sig) return null;
  const header = JSON.parse(new TextDecoder().decode(b64url(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64url(p)));
  if (header.alg !== "RS256") return null;
  const jwk = (await getKeys(env.ACCESS_TEAM)).find((k) => k.kid === header.kid);
  if (!jwk) return null;
  const key = await crypto.subtle.importKey("jwk", jwk, { name: "RSASSA-PKCS1-v1_5", hash: "SHA-256" }, false, ["verify"]);
  const ok = await crypto.subtle.verify("RSASSA-PKCS1-v1_5", key, b64url(sig), new TextEncoder().encode(h + "." + p));
  if (!ok) return null;
  const auds = env.ACCESS_AUD.split(",").map((s) => s.trim()).filter(Boolean);
  if (payload.exp < Date.now() / 1000) return null;
  if (![].concat(payload.aud || []).some((a) => auds.includes(a))) return null;
  if (payload.iss !== `https://${env.ACCESS_TEAM}.cloudflareaccess.com`) return null;
  return payload;
}

export async function onRequestGet({ request, env }) {
  const json = (body, status) =>
    new Response(JSON.stringify(body), { status, headers: { "Content-Type": "application/json", "Cache-Control": "no-store" } });
  if (!env.GITHUB_TOKEN || !env.ACCESS_TEAM || !env.ACCESS_AUD) return json({ error: "not_configured" }, 500);
  let user = null;
  try { user = await verify(request.headers.get("Cf-Access-Jwt-Assertion"), env); } catch (e) {}
  if (!user) return json({ error: "unauthorized" }, 401);
  return json({ token: env.GITHUB_TOKEN, email: user.email }, 200);
}
