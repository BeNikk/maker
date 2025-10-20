import { Fragment } from "@/lib/generated/prisma";
import { Button } from "./ui/button";

export const FragmentView = ({ data }: { data: Fragment }) => {
  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 border-b bg-sidebar flex items-center gap-x-2">
        <Button size={"sm"} variant={"outline"} onClick={() => {}}>
          Refresh
        </Button>
        <Button size={"sm"} variant={"outline"} onClick={() => {}}>
          Refresh
        </Button>
      </div>
      <iframe
        className="h-full w-full "
        sandbox="allow-forms allow-scripts allow-same-origin"
        loading="lazy"
        src={data.sandboxUrl}
      />
    </div>
  );
};
