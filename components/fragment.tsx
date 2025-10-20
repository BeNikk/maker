import { Fragment } from "@/lib/generated/prisma";
import { Button } from "./ui/button";
import { ExternalLinkIcon, RefreshCcwIcon } from "lucide-react";
import { useState } from "react";

export const FragmentView = ({ data }: { data: Fragment }) => {
  const [fragKey, setFragKey] = useState(0);
  const [copied, setCopied] = useState(false);

  function refresh() {
    setFragKey((prev) => prev + 1);
  }
  function handleCopy() {
    navigator.clipboard.writeText(data.sandboxUrl);
    setCopied(true);
    setTimeout(() => {
      setCopied(false), 2000;
    });
  }
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Button size={"sm"} variant={"outline"} onClick={refresh}>
          <RefreshCcwIcon />
        </Button>
        <Button
          size={"sm"}
          variant={"outline"}
          disabled={copied || !data.sandboxUrl}
          onClick={handleCopy}
          className="flex-1 justify-start text-start font-normal"
        >
          <span>{data.sandboxUrl}</span>
        </Button>
        <Button
          size={"sm"}
          disabled={!data.sandboxUrl}
          variant={"outline"}
          onClick={() => {
            if (!data.sandboxUrl) {
              return;
            }
            window.open(data.sandboxUrl, "_blank");
          }}
        >
          <ExternalLinkIcon />
        </Button>
      </div>
      <iframe
        key={fragKey}
        className="h-full w-full "
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
};
