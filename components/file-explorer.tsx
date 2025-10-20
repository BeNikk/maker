import { useCallback, useMemo, useState } from "react";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "./ui/resizable";
import { CodeView } from "./code-view";
import { convertFilesToTreeItems } from "@/lib/utils";
import { TreeView } from "./tree-view";

type FileCollection = { [path: string]: string };

interface FileExplorerProps {
  files: FileCollection;
}
export const FileExplorer = ({ files }: FileExplorerProps) => {
  const [selectedFile, setSelectedFile] = useState<string | null>(() => {
    const fileKeys = Object.keys(files);
    return fileKeys.length > 0 ? fileKeys[0] : null;
  });
  const treeData = useMemo(()=>{
    return convertFilesToTreeItems(files);
  },[files])

  const handleFileSelect = useCallback((filepath:string)=>{
    if(files[filepath]){
        setSelectedFile(filepath);
    }
  },[files]);

  return (
    <ResizablePanelGroup direction="horizontal">
      <ResizablePanel defaultSize={30} minSize={30} className="bg-sidebar">
        <TreeView
        data={treeData}
        value={selectedFile}
        onSelect={handleFileSelect}
        />
        <p>tree</p>
      </ResizablePanel>
      <ResizableHandle className="hover:bg-primary transition-colors" />
      <ResizablePanel defaultSize={70} minSize={30}>
        {selectedFile && files[selectedFile] ? (
            <div className="h-full w-full flex flex-col">
                <div className="flex-1 overflow-auto ">
                    <CodeView
                    code={files[selectedFile]}
                    lang={getLanguageFromFile(selectedFile)}
                    />
                </div>
            </div>

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
