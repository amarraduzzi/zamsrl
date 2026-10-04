// Starts the GitHub OAuth flow for the CMS login (Cloudflare Pages Function).
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const state = crypto.randomUUID();
  const params = new URLSearchParams({
    client_id: env.GITHUB_CLIENT_ID,
    scope: "repo,user",
    state,
    redirect_uri: url.origin + "/api/callback",
  });
  return new Response(null, {
    status: 302,
    headers: {
      Location: "https://github.com/login/oauth/authorize?" + params,
      "Set-Cookie": `oauth_state=${state}; HttpOnly; Secure; Path=/; Max-Age=600; SameSite=Lax`,
    },
  });
}
