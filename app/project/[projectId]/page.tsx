const Page = async({params}: {params:Promise<{projectId:string}>})=>{
    const { projectId }= await params;
    return(
        <>
        projectId: {projectId}
        </>
    )

}
export default Page;