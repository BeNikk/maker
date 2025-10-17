import Sandbox from "@e2b/code-interpreter";

export default async function getSandbox(sandboxId:string){
    const sandbox = await Sandbox.connect(sandboxId);
    return sandbox;
    
}