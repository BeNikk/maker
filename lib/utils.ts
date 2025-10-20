import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function convertFilesToTreeItems(files:{[path:string]:string}):TreeItems[]{
  interface Node {
    [key:string]:Node | null;
  }
  const tree:Node = {};
  const sortedPaths = Object.keys(files).sort();
  for (const filepath of sortedPaths){
    const parts = filepath.split('/');
    let current = tree;
    for(let i=0;i<parts.length-1;i++){
      const part = parts[i];
      if(!current[part]){
        current[part] = {};

      }
      current = current[part];
    }
    const fileName = parts[parts.length-1];
    current[fileName] = null;
  }
  function convertNode(node:Node, name?:string):TreeItems[] | TreeItems{
    const entries = Object.entries(node);
    if(entries.length == 0){
      return name || "";
    }
    const children:TreeItems[] = [];
    for(const [key,value] of entries){
      if(value == null){
        //this is a file
        children.push(key)
      }
      else{
        //this a folder
        const subTree = convertNode(value,key);
        if(Array.isArray(subTree)){
          children.push([key,...subTree]);
        }
        else{
          children.push([key,subTree]);
        }
      }
    }
    return children;
  }
  const result = convertNode(tree);
  return Array.isArray(result)? result:[result];
}

export type TreeItems = string | [string, ...TreeItems[]];
