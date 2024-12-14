import { Award, Member, News, Project, Publication } from './DefaultStructure';
import { sai_awards, sai_members, sai_news, sai_projects, sai_publications } from './constant';

// 8時間ごと
export async function fetchAwards() {
  const response = await fetch(sai_awards, {
    next: { revalidate: 3600 * 8 },
  });
  return ((await response.json()) as Award[]).filter((item) => item.id !== '');
}

// 1時間ごと
export async function fetchProjects() {
  const response = await fetch(sai_projects, {
    next: { revalidate: 3600 },
  });
  return ((await response.json()) as Project[]).filter((item) => item.id !== '');
}

// 30分ごと
export async function fetchPublications() {
  const response = await fetch(sai_publications, {
    next: { revalidate: 1800 },
  });
  return ((await response.json()) as Publication[]).filter((item) => item.id !== '');
}

// 5分ごと
export async function fetchNews() {
  const response = await fetch(sai_news, {
    next: { revalidate: 300 },
  });
  return ((await response.json()) as News[]).filter((item) => item.id !== '');
}

// 6時間ごと
export async function fetchMembers() {
  const response = await fetch(sai_members, {
    next: { revalidate: 3600 * 6 },
  });
  return ((await response.json()) as Member[]).filter((item) => item.id !== '');
}
