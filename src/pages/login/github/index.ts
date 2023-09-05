import type { APIRoute } from "astro";
import { githubAuth } from "~/utils/auth/lucia";

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
export const GET: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect("/", 302); // redirect to profile page
  }
  const [url, state] = await githubAuth.getAuthorizationUrl();
  context.cookies.set("github_oauth_state", state, {
    httpOnly: true,
    secure: !import.meta.env.DEV,
    path: "/",
    maxAge: 60 * 60,
  });
  return context.redirect(url.toString(), 302);
};
