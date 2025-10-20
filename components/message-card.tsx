import { Fragment, MessageRole, Type } from "@/lib/generated/prisma";
import { Card } from "./ui/card";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import Image from "next/image";
import { CodeIcon } from "lucide-react";
export const MessageCard = ({
  content,
  role,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: {
  key: string;
  content: string;
  role: MessageRole;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: Type;
}) => {
  if (role == "ASSISTANT") {
    return (
      <AssistantMessage
        content={content}
        fragment={fragment}
        createdAt={createdAt}
        isActiveFragment={isActiveFragment}
        onFragmentClick={onFragmentClick}
        type={type}
      />
    );
  }
  return (
    <div>
      <UserMessage content={content} />
    </div>
  );
};

const UserMessage = ({ content }: { content: string }) => {
  return (
    <div className="flex justify-end pb-4 pr-2 pl-10">
      <Card className="rounded-lg bg-muted p-3 shadow-none border-none max-w-[80%] break-words">
        {content}
      </Card>
    </div>
  );
};

const AssistantMessage = ({
  content,
  fragment,
  createdAt,
  isActiveFragment,
  onFragmentClick,
  type,
}: {
  content: string;
  fragment: Fragment | null;
  createdAt: Date;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
  type: Type;
}) => {
  return (
    <div
      className={cn(
        "flex flex-col group px-2 pb-4 ",
        type == "ERROR" && "text-red-700 dark:text-red-500"
      )}
    >
      <div className="flex flex-row items-center gap-2 pl-2 mb-2">
        <Image
          src={"/logo.svg"}
          alt="logo"
          height={18}
          width={18}
          className="shrink-0"
        />
        <span className="text-sm font-medium">Maker</span>
        <span className="text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
          {format(createdAt, "HH:mm 'on' MMM dd, yyyy ")}
        </span>
      </div>
      <div className="pl-8 flex flex-col gap-y-4">
        <span>{content}</span>
        {fragment && type == "RESULT" && (
          <FragmentCard
            fragment={fragment}
            isActiveFragment={isActiveFragment}
            onFragmentClick={onFragmentClick}
          />
        )}
      </div>
    </div>
  );
};

const FragmentCard = ({
  fragment,
  isActiveFragment,
  onFragmentClick,
}: {
  fragment: Fragment;
  isActiveFragment: boolean;
  onFragmentClick: (fragment: Fragment) => void;
}) => {
  return (
    <button
      className={cn(
        "flex items-start text-start gap-2 rounded-lg bg-muted w-fit p-3 hover:bg-secondary",
        isActiveFragment &&
          "bg-primary text-primary-foreground border-primary hover:bg-primary"
      )}
      onClick={() => onFragmentClick(fragment)}
    >
      <CodeIcon className="h-4 w-3 mt-0.5" />
      <div className="flex flex-col flex-1">
        <span className="text-sm font-medium line-clamp-1">
          {" "}
          
        </span>
        <span className="text-sm font-medium line-clamp-1">See your site</span>
      </div>
    </button>
  );
};
