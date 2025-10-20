import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation";
import { ProjectForm } from "@/components/project-form";

const Page =()=>{
      const [value,setValue] = useState("");
  const trpc = useTRPC();
  const router = useRouter();
  const createProject = useMutation(trpc.projects.create.mutationOptions({
    onSuccess:(data)=>{
      router.push(`/project/${data.id}`)
    }
  }))
  return(
    <div>
        
    </div>
  )

}