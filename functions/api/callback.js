// Finishes the GitHub OAuth flow and hands the token back to the CMS window.
export async function onRequestGet({ request, env }) {
  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");
  const cookie = (request.headers.get("Cookie") || "").match(/oauth_state=([^;]+)/);
  if (!code || !state || !cookie || cookie[1] !== state) {
    return new Response("Invalid OAuth state", { status: 400 });
  }
  const res = await fetch("https://github.com/login/oauth/access_token", {
    method: "POST",
    headers: { "Content-Type": "application/json", Accept: "application/json" },
    body: JSON.stringify({
      client_id: env.GITHUB_CLIENT_ID,
      client_secret: env.GITHUB_CLIENT_SECRET,
      code,
    }),
  });
  const data = await res.json();
  const ok = !!data.access_token;
  const msg = ok
    ? "authorization:github:success:" + JSON.stringify({ token: data.access_token, provider: "github" })
    : "authorization:github:error:" + JSON.stringify({ message: data.error_description || "Login failed" });
  const html = `<!doctype html><meta charset="utf-8"><script>
(function () {
  var msg = ${JSON.stringify(msg)};
  function receive(e) { window.opener.postMessage(msg, e.origin); }
  window.addEventListener("message", receive, false);
  window.opener.postMessage("authorizing:github", "*");
})();
</script>`;
  return new Response(html, {
    headers: {
      "Content-Type": "text/html; charset=utf-8",
      "Set-Cookie": "oauth_state=; HttpOnly; Secure; Path=/; Max-Age=0",
    },
  });
}
