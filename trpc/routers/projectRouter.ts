import z from "zod";
import { protectedProcedure, createTRPCRouter } from "../init";
import prisma from "@/lib/prisma";
import { generateSlug } from 'random-word-slugs';
import { inngest } from "@/src/inngest/client";
import { TRPCError } from "@trpc/server";

export const projectRouter = createTRPCRouter({
    create:protectedProcedure
    .input(
        z.object(
            {
                value:z.string().min(1,{message:"should be of min 1 length"})
            }
        )
    ).mutation(async({input})=>{
        const createdProject = await prisma.project.create({
            data:{
                name:generateSlug(2,{
                    format:"title"
                }),
                messages:{
                    create:{
                        content:input.value,
                        role:"USER",
                        type:"RESULT"
                    }
                }

            }
        })

        await inngest.send({
            name:"code-agent/run",
            data:{
                value:input.value,
                projectId:createdProject.id
            }
        })
        return createdProject;
    }),
    getMany:protectedProcedure
    .query(async()=>{
        const projects = await prisma.project.findMany({
            orderBy:{
                updatedAt:"asc"
            },

        })
        return projects;
    }),
    getOne:protectedProcedure
    .input(z.object({
        id: z.string().min(1,{message:"Id is required"})
    })).query(async({input})=>{
        const project = await prisma.project.findUnique({
            where:{
                id:input.id
            }
        })
        if(!project){
            throw new TRPCError({code:"NOT_FOUND",message: "project not found"});
        }
        return project;
    })
})