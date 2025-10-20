import { ProjectView } from "@/components/project-view";
import { getQueryClient, trpc } from "@/trpc/server";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { Suspense } from "react";

const Page = async({params}: {params:Promise<{projectId:string}>})=>{
    const { projectId }= await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId:projectId
    }));
    void queryClient.prefetchQuery(trpc.projects.getOne.queryOptions({
        id:projectId
    }));


    return(
        <HydrationBoundary state={dehydrate(queryClient)}>
            <Suspense fallback={<>Loading</>}> 
            <ProjectView projectId={projectId} />
            </Suspense>
        </HydrationBoundary>
    )

}
export default Page;