"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "./ui/resizable";
import { MessageContainer } from "./message-container";
import { Suspense } from "react";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const trpc = useTRPC();
  const { data: project } = useSuspenseQuery(
    trpc.projects.getOne.queryOptions({
      id: projectId,
    })
  );

  return (
    <div className="h-screen">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel
        defaultSize={35}
        minSize={20}
        className="flex flex-col min-h-0"
        >
            <Suspense fallback= {<p>Loading...</p>}>
            <MessageContainer projectId={projectId}/>

            </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle/>
        <ResizablePanel
        defaultSize={65}
        minSize={50}
        >
            project preview
            </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
