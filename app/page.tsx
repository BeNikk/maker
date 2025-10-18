"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Input } from "@/components/ui/input"

export default  function Home() {
  const [value,setValue] = useState("");
  const trpc = useTRPC();
  const invoke = useMutation(trpc.messages.create.mutationOptions({
    onSuccess:()=>{
      toast.success("BG job started");
    }
  }));
  return (
    <div>
      test
      <Button onClick={()=>{
        invoke.mutate({value:value});
      }}>
        Click
      </Button>
      <Input value={value} onChange={(e)=>{setValue(e.target.value)}}/>
    </div>

  );
}
