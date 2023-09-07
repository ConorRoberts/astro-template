import { libsql } from "@lucia-auth/adapter-sqlite";
import { github } from "@lucia-auth/oauth/providers";
import { lucia } from "lucia";
import { astro } from "lucia/middleware";
import { libsqlClient } from "~/db/client";

// https://lucia-auth.com/

export const auth = lucia({
  env: import.meta.env.DEV ? "DEV" : "PROD",
  adapter: libsql(libsqlClient, {
    key: "user_key",
    session: "user_session",
    user: "user",
  }),
  middleware: astro(),

  getUserAttributes: (data) => {
    return {
      id: data.id,
      name: data.name,
    };
  },
});

export const githubAuth = github(auth, {
  clientId: import.meta.env.GITHUB_CLIENT_ID,
  clientSecret: import.meta.env.GITHUB_CLIENT_SECRET,
});

export type Auth = typeof auth;
