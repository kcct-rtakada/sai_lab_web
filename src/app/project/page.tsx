import ProjectsViewer from "@/components/project_list/ProjectsViewer";
import { Project } from "@/components/DefaultStructure";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import { fetchProjects } from "@/components/GASFetch";
import { Suspense } from "react";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Project",
    description: "SAI (髙田研究室)のプロジェクト一覧",
    url: `https://sai.ac/project`,
    imageUrl: undefined,
  });
}

export default async function ProjectList() {
  const response = await fetchProjects();
  const projects: Project[] = await response.json();
  const filteredProjects = projects.filter((item) => item.id !== "");

  return (
    <Suspense>
      <ProjectsViewer _projects={filteredProjects} />
    </Suspense>
  );
}
