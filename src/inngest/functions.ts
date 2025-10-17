import { inngest } from "./client";
import { createAgent, gemini } from "@inngest/agent-kit";
import { Sandbox } from "@e2b/code-interpreter";
import getSandbox from "./utils";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
    // Create a new agent with a system prompt (you can add optional tools, too)
    const sandboxId = await step.run("get-sandbox-id", async() => {
      const sbx = await Sandbox.create("unlovable-next-test2");
      return sbx.sandboxId;
    });
    const coder = createAgent({
      name: "summariser",
      system:
        "You are an expert next js developer. you write readable beautiful maintainable code,you write great code",
      model: gemini({ model: "gemini-2.5-pro" }),
    });

    const { output } = await coder.run(
      `Write the code for the following prompt- ${event.data.value}`
    );
    console.log(output);
    // await step.sleep("wait-a-moment", "10s");
    const sandBoxUrl = await step.run("get-sandbox-url",async()=>{
        const sandbox = await getSandbox(sandboxId);
        const host =  sandbox.getHost(3000);
        return `https://${host}`;
    })
    console.log(sandBoxUrl);

    return { output, sandBoxUrl };
  }
);
