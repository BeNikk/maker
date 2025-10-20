import { useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";

type FileCollection = { [path: string]: string };

interface FileExplorerProps {
  files: FileCollection;
}
export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <p>tree</p>
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={30}>
        {selectedFile && files[selectedFile] ? (
          <div>code view</div>
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground">
            Select a file to view its components
          </div>
        )}
      </ResizablePanel>
    </ResizablePanelGroup>
  );
};

function getLanguageFromFile(fileName: string): string {
  const extension = fileName.split(".").pop()?.toLowerCase();
  return extension || "text";
}
