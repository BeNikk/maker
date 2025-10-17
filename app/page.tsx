import Client from "@/components/client";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

export default async function Home() {
  const queryClient = getQueryClient();
  void queryClient.prefetchQuery(trpc.bye.queryOptions({ text: "nikhil" }));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <Suspense>
        <Client />
      </Suspense>
    </HydrationBoundary>
  );
}
