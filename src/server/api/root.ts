import { createTRPCRouter } from "~/server/api/trpc";
import { authRouter } from "./routers/auth";
import { workspaceRouter } from "./routers/workspace";
import { formRouter } from "./routers/forms/router";

/**
 * This is the primary router for your server.
 *
 * All routers added in /api/routers should be manually added here.
 */
export const appRouter = createTRPCRouter({
  auth: authRouter,
  workspace: workspaceRouter,
  form: formRouter
});

// export type definition of API
export type AppRouter = typeof appRouter;
