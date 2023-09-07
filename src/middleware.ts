import type { MiddlewareResponseHandler } from "astro";
import { auth } from "~/utils/auth";

export const onRequest: MiddlewareResponseHandler = async (context, next) => {
  context.locals.auth = auth.handleRequest(context);
  return await next();
};
