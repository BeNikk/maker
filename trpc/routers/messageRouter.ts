import z from "zod";
import { baseProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { inngest } from "@/src/inngest/client";

export const messageRouter = createTRPCRouter({
    create:baseProcedure
    .input(
        z.object(
            {
                value:z.string().min(1,{message:"should be of min 1 length"})
            }
        )
    ).mutation(async({input})=>{
        const newMessage = await prisma.message.create({
            data:{
                content:input.value,
                role:"USER",
                type:"RESULT"
            }
        })
        await inngest.send({
            name:"code-agent/run",
            data:{
                value:input.value
            }
        })
        return newMessage;
    }),
    getMany:baseProcedure
    .query(async()=>{
        const messages = await prisma.message.findMany({
            orderBy:{
                updatedAt:"asc"
            },
            include:{
                fragment:true
            }
        })
        return messages;
    })
})