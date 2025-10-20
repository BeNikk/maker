import { useEffect } from 'react';
import './code-theme.css';
import Prism from "prismjs";
import "prismjs/components/prism-typescript"
import "prismjs/components/prism-jsx"
import "prismjs/components/prism-tsx"
import "prismjs/components/prism-javacript"


export const CodeView = ({code, lang}:{code:string, lang:string})=>{

    useEffect(()=>{
        Prism.highlightAll();
    },[code])
    return(
        <pre className="p-2 bg-transparent border-none rounded-none m-0 text-xs">
            <code className={`language-${lang}`}>
                {code}
            </code>

        </pre>
    )
}