import z from "zod";
import getSandbox from "./utils";
import { createTool } from "@inngest/agent-kit";

export function terminalTool(sandboxId: string) {
  return createTool({
    name: "terminal",
    description: "use the terminal to run the commands",
    parameters: z.object({
      command: z.string(),
    }),
    handler: async ({ command }, { step }) => {
      return await step?.run("terminal", async () => {
        const buffers = { stdout: "", stderr: "" };
        try {
          //using sandbox apis to run terminal commands
          const sandbox = await getSandbox(sandboxId);
          const result = await sandbox.commands.run(command, {
            onStdout: (data: string) => {
              buffers.stdout += data;
            },
            onStderr: (data: string) => {
              buffers.stderr += data;
            },
          });
          return result.stdout;
        } catch (e) {
          console.log("error", e);
          return `Command failed: ${e} \n stdout:${buffers.stdout} \n stderr: ${buffers.stderr}`;
        }
      });
    },
  });
}

export function createOrUpdateFiles(sandboxId: string) {
  return createTool({
    name: "create_or_update_files",
    description: "create or update files in the sandbox",
    parameters: z.object({
      files: z.array(
        z.object({
          path: z.string(),
          content: z.string(),
        })
      ),
    }),
    handler: async ({ files }, { step, network }) => {
      const newFiles = await step?.run("create_or_update_files", async () => {
        try {
          const updatedFiles = network.state.data.files || {};
          const sandbox = await getSandbox(sandboxId);
          for (const file of files) {
            await sandbox.files.write(file.path, file.content);
            updatedFiles[file.path] = file.content;
          }
          return updatedFiles;
        } catch (error) {
          return `error:${error}`;
        }
      });
      if (typeof newFiles == "object") {
        network.state.data.files = newFiles;
      }
    },
  });
}
export function readFilesTool(sandboxId: string) {
  return createTool({
    name: "read_files",
    description: "read files from the sandbox",
    parameters: z.object({
      files: z.array(z.string()),
    }),
    handler: async ({ files }, { step }) => {
      return await step?.run("read-files", async () => {
        try {
          const sandbox = getSandbox(sandboxId);
          const contents = [];
          for (const file of files) {
            const content = (await sandbox).files.read(file);
            contents.push({ path: file, content });
          }
          return JSON.stringify(contents);
        } catch (error) {
          console.log("error in reading files tool", error);
          return `Error ${error}`;
        }
      });
    },
  });
}
