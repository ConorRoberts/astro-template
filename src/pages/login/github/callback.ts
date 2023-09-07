import { OAuthRequestError } from "@lucia-auth/oauth";
import { auth, githubAuth } from "~/utils/auth";

import { createId } from "@paralleldrive/cuid2";
import type { APIRoute } from "astro";
import { AFTER_LOGIN_URL } from "~/utils/constants/auth-urls";

// https://docs.github.com/en/apps/oauth-apps/building-oauth-apps/creating-an-oauth-app
export const GET: APIRoute = async (context) => {
  const session = await context.locals.auth.validate();
  if (session) {
    return context.redirect(AFTER_LOGIN_URL, 302);
  }

  const storedState = context.cookies.get("github_oauth_state")?.value;
  const state = context.url.searchParams.get("state");
  const code = context.url.searchParams.get("code");

  // validate state
  if (!storedState || !state || storedState !== state || !code) {
    return new Response(null, {
      status: 400,
    });
  }

  try {
    const { getExistingUser, githubUser, createUser } = await githubAuth.validateCallback(code);

    const getUser = async () => {
      const existingUser = await getExistingUser();
      if (existingUser) return existingUser;
      const user = await createUser({
        attributes: {
          id: createId(),
          name: githubUser.name,
        },
      });
      return user;
    };

    const user = await getUser();
    const session = await auth.createSession({
      userId: user.userId,
      attributes: {},
    });

    context.locals.auth.setSession(session);

    return context.redirect(AFTER_LOGIN_URL, 302);
  } catch (e) {
    console.log(e);
    if (e instanceof OAuthRequestError) {
      // invalid code
      return new Response(null, {
        status: 400,
      });
    }
    return new Response(null, {
      status: 500,
    });
  }
};
