import ProjectsViewer from "@/components/ProjectsViewer";
import Project from "@/components/DefaultStructure";
import { sai_projects } from "@/components/constant";

export default async function Home() {
  const response = await fetch(sai_projects);
  const projects: Project[] = await response.json();

  return <ProjectsViewer _projects={projects} />;
}
