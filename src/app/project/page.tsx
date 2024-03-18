import ProjectsViewer from "@/components/project_list/ProjectsViewer";
import { Project } from "@/components/DefaultStructure";
import SEO from "@/components/common/SEO";
import type { Metadata } from "next";
import { fetchProjects } from "@/components/GASFetch";
import { Suspense } from "react";
import styles from "@/styles/app/projects/projectList.module.scss";

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
  // 空要素がある場合は取り除く
  const filteredProjects = projects.filter((item) => item.id !== "");

  // クライアントコンポーネントで描画
  return (
    <Suspense
      fallback={
        <div className={styles.main}>
          <div className={styles.title_box}>
            <div className={styles.title_area}>
              <h1 className={styles.page_title}>プロジェクト</h1>
            </div>
          </div>
          <div className="loading">
            <span className="load_1" />
            <span className="load_2" />
          </div>
        </div>
      }
    >
      <ProjectsViewer _projects={filteredProjects} />
    </Suspense>
  );
}
