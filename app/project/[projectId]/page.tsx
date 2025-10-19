import { getQueryClient, trpc } from "@/trpc/server";

const Page = async({params}: {params:Promise<{projectId:string}>})=>{
    const { projectId }= await params;
    const queryClient = getQueryClient();
    void queryClient.prefetchQuery(trpc.messages.getMany.queryOptions({
        projectId:projectId
    }));
    
    return(
        <>
        projectId: {projectId}
        </>
    )

}
export default Page;