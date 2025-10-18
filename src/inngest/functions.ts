import { inngest } from "./client";
import { createAgent, createNetwork, createTool, gemini } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import getSandbox, { lastMessageAssistant } from "./utils";
import { createOrUpdateFiles, readFilesTool, terminalTool } from "./tools";
import { PROMPT } from "./prompt";
import prisma from "@/lib/prisma";

export const codeAgent = inngest.createFunction(
  { id: "code-agent" },
  { event: "code-agent/run" },
  async ({ event, step }) => {
    // Create a new agent with a system prompt (you can add optional tools, too)
    const sandboxId = await step.run("get-sandbox-id", async() => {
      const sbx = await Sandbox.create("unlovable-next-test2");
      return sbx.sandboxId;
    });
    const coder = createAgent({
      name: "code-agent",
      description:"Expert, senior coding agent",
      system:PROMPT,
      model: gemini({ model: "gemini-2.5-pro"}),
      tools:[terminalTool(sandboxId),
        createOrUpdateFiles(sandboxId),
        readFilesTool(sandboxId),
      ],
      lifecycle:{
        onResponse:async ({result,network})=>{
            const lastMessage = lastMessageAssistant(result);
            if(lastMessage && network){
                if(lastMessage.includes("<task_summary>")){
                    network.state.data.summary = lastMessage;

                }
            }
            return result;
        }
      }
    });

    const network = createNetwork({
        name:"Coding agent network",
        agents:[coder],
        maxIter:15,
        router:async ({network})=>{
            const summary = network.state.data.summary;
            if(summary){
             return;   
            }
            return coder;
        }
    })
    const result = await network.run(event.data.value);
    // await step.sleep("wait-a-moment", "10s");
    const sandBoxUrl = await step.run("get-sandbox-url",async()=>{
        const sandbox = await getSandbox(sandboxId);
        const host =  sandbox.getHost(3000);
        return `https://${host}`;
    })

    console.log(sandBoxUrl);
    await step.run("save-result",async()=>{
        return await prisma.message.create({
            data:{
                content:result.state.data.summary,
                role:"ASSISTANT",
                type:"RESULT",
                fragment:{
                    create:{
                        sandboxUrl:sandBoxUrl,
                        title:"Fragment",
                        files:result.state.data.files,
                    }
                }
            }
        })
    })

    return { url:sandBoxUrl,
        title:"Fragment",
        files:result.state.data.files,
        summary:result.state.data.summary
     };
  }
);
