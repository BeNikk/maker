import { inngest } from "./client";
import { Agent, createAgent, gemini } from "@inngest/agent-kit";

export const helloWorld = inngest.createFunction(
  { id: "hello-world" },
  { event: "test/hello.world" },
  async ({ event, step }) => {
        // Create a new agent with a system prompt (you can add optional tools, too)
    const coder= createAgent({
      name: "summariser",
      system: "You are an expert next js developer. you write readable beautiful maintainable code,you write great code",
      model: gemini({ model:"gemini-2.5-pro"}),
    });

    const { output } = await coder.run(`Write the code for the following prompt- ${event.data.value}`);
    console.log(output);
    // await step.sleep("wait-a-moment", "10s");   
    return { output };
  },
);