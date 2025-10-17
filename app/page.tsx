"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";

export default  function Home() {
  const trpc = useTRPC();
  const invoke = useMutation(trpc.callInngest.mutationOptions({}));
  return (
    <div>
      test
      <Button onClick={()=>{
        invoke.mutate({email:"nikhil"});
      }}>
        Click
      </Button>
    </div>

  );
}
