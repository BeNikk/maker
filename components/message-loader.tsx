import Image from "next/image";
import { useEffect, useState } from "react";

const Message = ()=>{
 const messages = [
    "Maker is creating your website",
    "Crazy how I can do it and you have no idea to do so",
    "You think you can get a $10k mrr using this?",
    "I am almost done, how insanely good it is",
    "Fuck off"
 ];
 const [currentMessageIndex,setCurrentMessageIndex] = useState(0);
 useEffect(()=>{
    const interval = setInterval(()=>{
        setCurrentMessageIndex((prev) => (prev+1)%messages.length);
    },2000)
    return ()=>clearInterval(interval);
 },[messages.length])  
 return(
    <div className="flex items-center gap-2">
        <span className="text-base text-muted-foreground animate-false">
            {messages[currentMessageIndex]}
        </span>
    </div>
 )
}

export const MessageLoading = () =>{
    return(
        <div className="flex flex-col group px-2 pb-4">
            <div className="flex items-center gap-2 pl-2 mb-2">
                <Image
                src="/logo.svg"
                alt="logo"
                width={18}
                height={18}
                className="shrink-0"
                />
                <span className="text-sm font-medium">Maker</span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <Message/>
            </div>
        </div>
    )
}
