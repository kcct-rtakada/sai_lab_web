import ProjectsViewer from "@/components/project_list/ProjectsViewer";
import Project from "@/components/DefaultStructure";
import { sai_projects } from "@/components/constant";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  return SEO({
    title: "Project",
    description: "SAI (髙田研究室)のプロジェクト一覧",
    url: `https://sai.ac/project`,
    imageUrl: undefined,
  });
}

export default async function ProjectList() {
  const response = await fetch(sai_projects);
  const projects: Project[] = await response.json();
  const filteredProjects = projects.filter((item) => item.id !== "");

  return <ProjectsViewer _projects={filteredProjects} />;
}
