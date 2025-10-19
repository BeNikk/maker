import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import TextareaAutosize from "react-textarea-autosize";
import z from "zod";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Form, FormField } from "./ui/form";
import { cn } from "@/lib/utils";
import { Button } from "./ui/button";
import {  ArrowUpIcon, Loader2Icon } from "lucide-react";
import { useTRPC } from "@/trpc/client";

const formSchema = z.object({
  value: z.string().min(1, { message: "Value is required" }),
});
export const MessageForm = ({ projectId }: { projectId: string }) => {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const createMessage = useMutation(trpc.messages.create.mutationOptions(
    {
        onSuccess:(data)=>{
            form.reset()
            queryClient.invalidateQueries(trpc.messages.getMany.queryOptions({projectId}))
        },
    }
  ));
  const isPending = createMessage.isPending;

  const [isFocused, setIsFocused] = useState(false);
  const showUsage = false;
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      value: "",
    },
  });
  const disabled = isPending || !form.formState.isValid;
  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    await createMessage.mutateAsync({
      value: values.value,
      projectId,
    });
  };
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className={cn(
          "relative border p-4 pt-1 rounded-xl bg-sidebar dark:bg-sidebar transition-all",
          isFocused && "shdow-xs",
          showUsage && "rounded-t-none"
        )}
      >
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <TextareaAutosize
              disabled={isPending}
              {...field}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              minRows={2}
              maxRows={8}
              className="pt-4 resize-none border-none w-full outline-none bg-transparent"
              placeholder="Explain your idea"
              onKeyDown={(e) => {
                if (e.key == "Enter" && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault();
                  form.handleSubmit(onSubmit)(e);
                }
              }}
            />
          )}
        />
        <div className="flex gap-x-2 items-end justify-between pt-2">
          <div className="text-[10px] text-muted-foreground font-mono">
            <kbd className="ml-auto pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono  text-[10px] font-medium text-muted-foreground">
              <span>&#8984;</span>Enter
            </kbd>
            &nbsp; to submit
          </div>
          <Button disabled={disabled} className={cn("w-4 h-4 rounded-full ")}>
            {isPending ? (
              <Loader2Icon className="h-4 w-4 animate-spin" />
            ) : (
              <ArrowUpIcon />
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};
