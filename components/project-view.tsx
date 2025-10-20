"use client";

import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { MessageContainer } from "./message-container";
import {  Suspense, useState } from "react";
import { Fragment } from "@/lib/generated/prisma";
import { ProjectHeader } from "./message-header";
import { FragmentView } from "./fragment";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { CodeIcon, EyeIcon } from "lucide-react";
import { FileExplorer } from "./file-explorer";

interface Props {
  projectId: string;
}

export const ProjectView = ({ projectId }: Props) => {
  const [activeFragment, setActiveFragment] = useState<Fragment | null>(null);
  const [tabState, setTabState] = useState<"preview" | "code">("preview");

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
          <ProjectHeader projectId={projectId} />
          <Suspense fallback={<p>Loading...</p>}>
            <MessageContainer
              projectId={projectId}
              activeFragment={activeFragment}
              setActiveFragment={setActiveFragment}
            />
          </Suspense>
        </ResizablePanel>
        <ResizableHandle withHandle />
        <ResizablePanel defaultSize={65} minSize={50}>
          <Tabs
            className="h-full gap-y-0"
            defaultValue="preview"
            value={tabState}
            onValueChange={(value) => setTabState(value as "preview" | "code")}
          >
            <div className="w-full flex items-center p-2 border-b gap-x-2">
              <TabsList className="h-8 p-0 border rounded-md">
                <TabsTrigger value="preview" className="rounded-md">
                  <EyeIcon />
                  <span>Demo</span>
                </TabsTrigger>
                <TabsTrigger value="code" className="rounded-md">
                  <CodeIcon />
                  <span>Code</span>
                </TabsTrigger>
                <div className="ml-auto flex items-center gap-x-2"></div>
              </TabsList>
            </div>
            <TabsContent value="preview">
              {activeFragment && <FragmentView data={activeFragment} />}
            </TabsContent>
            <TabsContent value="code" className="h-full m-0">
                {activeFragment?.files && (
                    <FileExplorer
                    files={activeFragment.files as {[path:string]:string}}
                    />
                )}
            </TabsContent>
          </Tabs>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
};
