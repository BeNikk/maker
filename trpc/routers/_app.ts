
import { createTRPCRouter } from "../init";
import { messageRouter } from "./messageRouter";
import { projectRouter } from "./projectRouter";
export const appRouter = createTRPCRouter({
  messages:messageRouter,
  projects:projectRouter

});
// export type definition of API
export type AppRouter = typeof appRouter;
