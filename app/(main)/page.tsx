"use client";
import { useTRPC } from "@/trpc/client";
import { useQuery } from "@tanstack/react-query";
import { ProjectForm } from "@/components/project-form";
import Image from "next/image";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CalendarIcon, CodeIcon, FolderIcon } from "lucide-react";
import Link from "next/link";

export default function Home() {
  const trpc = useTRPC();

  const { data: projects, isLoading } = useQuery(
    trpc.projects.getMany.queryOptions()
  );

  return (
    <div className="flex flex-col max-w-5xl mx-auto w-full">
      <section className="space-y-6 py-[16vh] 2xl:py-48">
        <div className="flex flex-col items-center">
          <Image
            src={"/logo.svg"}
            alt="logo"
            width={50}
            height={50}
            className="hidden md:block"
          />
        </div>
        <h1 className="text-2xl md:text-5xl font-bold text-center">
          Turn your idea into reality with Maker
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground text-center">
          Create anything, just with a simple prompt
        </p>
        <div className="max-w-3xl mx-auto w-full">
          <ProjectForm />
        </div>
      </section>

      <section className="space-y-6 pb-16">
        <div className="text-center space-y-2">
          <h2 className="text-2xl md:text-3xl font-bold">
            Your Projects
          </h2>
          <p className="text-muted-foreground">
            Continue working on your previous projects or create something new
          </p>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="animate-pulse">
                <CardHeader>
                  <div className="h-6 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-10 bg-gray-200 rounded"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : projects && projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12 space-y-4">
            <div className="p-4 bg-muted rounded-full w-16 h-16 mx-auto flex items-center justify-center">
              <FolderIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-medium">No projects yet</h3>
            <p className="text-muted-foreground">
              Create your first project by describing your app idea above!
            </p>
          </div>
        )}
      </section>
    </div>
  );
};

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
  };
}

const ProjectCard = ({ project }: ProjectCardProps) => {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200 hover:border-primary/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg line-clamp-2 group-hover:text-primary transition-colors">
              {project.name}
            </CardTitle>
            <div className="flex items-center gap-1 text-sm text-muted-foreground">
              <CalendarIcon className="h-4 w-4" />
              <span>{new Date(project.createdAt).toLocaleDateString()}</span>
            </div>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300">
            Active
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="pt-0 space-y-3">
        <CardDescription className="line-clamp-2">
          Last updated {new Date(project.updatedAt).toLocaleDateString()}
        </CardDescription>
        
        <div className="flex items-center gap-2">
          <Button asChild size="sm" className="flex-1">
            <Link href={`/project/${project.id}`}>
              <CodeIcon className="h-4 w-4 mr-1" />
              Open Project
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
