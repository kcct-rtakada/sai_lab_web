import { sai_awards, sai_members, sai_news, sai_projects } from "./constant";

// 8時間ごと
export async function fetchAwards() {
  const response = await fetch(sai_awards, {
    next: { revalidate: 3600 * 8 },
  });
  return response;
}

// 1時間ごと
export async function fetchProjects() {
  const response = await fetch(sai_projects, {
    next: { revalidate: 3600 },
  });
  return response;
}

// 5分ごと
export async function fetchNews() {
  const response = await fetch(sai_news, {
    next: { revalidate: 300 },
  });
  return response;
}

// 6時間ごと
export async function fetchMembers() {
  const response = await fetch(sai_members, {
    next: { revalidate: 3600 * 6 },
  });
  return response;
}
