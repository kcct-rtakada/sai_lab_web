import ProjectsViewer from "@/components/project_list/ProjectsViewer";
import SEO from "@/components/common/SEO";
import { fetchProjects } from "@/components/GASFetch";
import { Suspense } from "react";
import styles from "@/styles/app/projects/projectList.module.scss";
import { getJsonLd } from "@/components/common/JsonLd";
import LoadingUI from "@/components/Loading";
import { Title } from "@/components/common/SubPageLayout";

export async function generateMetadata(
  { searchParams }: { searchParams: { [key: string]: string } }
) {
  const mode = searchParams['mode'] ?? null
  const q = searchParams['q'] ?? null

  const modeDic: { [key: string]: string } = {
    name: "研究題目",
    author: "著者",
    keyword: "キーワード",
    year: "発行年"
  }
  const modeDisplayName = modeDic[mode] ?? "不明"
  
  return SEO({
    title: `${q ? `[${modeDisplayName}]` + (q.length > 10 ? q.substring(0, 10) + "..." : q) + " の" : ""}Project`,
    description: "SAI (髙田研究室)のプロジェクト一覧",
    url: `/project`,
    imageUrl: undefined,
  });
}

export default async function ProjectList({ searchParams }: { searchParams: { [key: string]: string } }) {
  const projectList = await fetchProjects();

  const mode = searchParams['mode'] ?? null
  const q = searchParams['q'] ?? null

  const modeDic: { [key: string]: string } = {
    name: "研究題目",
    author: "著者",
    keyword: "キーワード",
    year: "発行年"
  }
  const modeDisplayName = modeDic[mode] ?? "不明"

  const jsonLd = getJsonLd(false, `${q ? `[${modeDisplayName}]` + (q.length > 10 ? q.substring(0, 10) + "..." : q) + " の" : ""}Project`, "SAI (髙田研究室)のプロジェクト一覧", "/project")

  // クライアントコンポーネントで描画
  return (
    <Suspense
      fallback={
        <div className={styles.main}>
          <Title color1="#dbc70e" color2="#44b835">
            <span>プロジェクト</span>
          </Title>
          <LoadingUI />
        </div>
      }
    >
      <ProjectsViewer _projects={projectList} />
    </Suspense>
  );
}
