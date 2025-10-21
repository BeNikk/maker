import Sandbox from "@e2b/code-interpreter";
import { AgentResult, TextMessage } from "@inngest/agent-kit";

export default async function getSandbox(sandboxId:string){
    const sandbox = await Sandbox.connect(sandboxId);
    await sandbox.setTimeout(60000*10)
    return sandbox;

}

export function lastMessageAssistant(result:AgentResult){
    const lastMessageIndex = result.output.findLastIndex(
        (message)=>message.role =="assistant"
    );
    const message = result.output[lastMessageIndex] as TextMessage | undefined;
    return message?.content? typeof message.content == "string" ? message.content :
    message.content.map((c)=>c.text).join("") : undefined;
}