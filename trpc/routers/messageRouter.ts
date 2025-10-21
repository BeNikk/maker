import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { inngest } from "@/src/inngest/client";
import { TRPCError } from "@trpc/server";

export const messageRouter = createTRPCRouter({
    create:protectedProcedure
    .input(
        z.object(
            {
                value:z.string().min(1,{message:"should be of min 1 length"}),
                projectId:z.string().min(1,{message:"Project id is required"})
            }
        )
    ).mutation(async({input,ctx})=>{
        const existingProject = await prisma.project.findUnique({
            where:{
                id:input.projectId,
                userId:ctx.auth.userId
            }
        });
        if(!existingProject){
            throw new TRPCError({code:"NOT_FOUND",message:"not found"});
        }

        const newMessage = await prisma.message.create({
            data:{
                content:input.value,
                role:"USER",
                type:"RESULT",
                projectId:existingProject.id
            }
        })
        await inngest.send({
            name:"code-agent/run",
            data:{
                value:input.value,
                projectId:input.projectId
            }
        })
        return newMessage;
    }),
    getMany:protectedProcedure
    .input(z.object({
        projectId:z.string().min(1,{message:"Project Id is required"})
    }))
    .query(async({input,ctx})=>{
        const messages = await prisma.message.findMany({
            where:{
                projectId: input.projectId,
                project:{
                    userId:ctx.auth.userId
                }
            },
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