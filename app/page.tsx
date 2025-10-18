"use client";

import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";

export default  function Home() {
  const [value,setValue] = useState("");
  const trpc = useTRPC();
  const router = useRouter();
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess:(data)=>{
      router.push(`/project/${data.id}`)
    }
  }))

  return (
    <div className="h-screen w-screen flex items-center justify-center">
      test
      <Button onClick={()=>{
        createProject.mutate({value:value });
      }}>
        Submit
      </Button>
      <Input value={value} onChange={(e)=>{setValue(e.target.value)}}/>
    </div>

  );
}
