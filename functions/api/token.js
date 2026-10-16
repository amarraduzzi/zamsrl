// Hands the CMS its GitHub key, only with a valid login cookie from /api/login.
import { configured, json, validSession } from "./_session.js";

export async function onRequestGet({ request, env }) {
  if (!configured(env)) return json({ error: "not_configured" }, 500);
  if (!(await validSession(request, env))) return json({ error: "unauthorized" }, 401);
  return json({ token: env.GITHUB_TOKEN });
}
