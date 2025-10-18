
import { createTRPCRouter } from "../init";
import { messageRouter } from "./messageRouter";
export const appRouter = createTRPCRouter({
  messages:messageRouter,

});
// export type definition of API
export type AppRouter = typeof appRouter;
