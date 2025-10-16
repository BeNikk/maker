import { useTRPC } from "@/trpc/client";

export default function Home() {
  const trpc = useTRPC();
  trpc.bye.queryOptions({text:"Hello"});
  return (
    <div>
      hello world
    </div>
  );
}
