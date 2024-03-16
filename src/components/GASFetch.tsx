import { sai_awards, sai_members, sai_news, sai_projects } from "./constant";

export async function fetchAwards() {
  const response = await fetch(sai_awards, {
    next: { revalidate: 3600 * 8 },
  });
  return response;
}

export async function fetchProjects() {
  const response = await fetch(sai_projects, {
    next: { revalidate: 3600 },
  });
  return response;
}

export async function fetchNews() {
  const response = await fetch(sai_news, {
    next: { revalidate: 300 },
  });
  return response;
}

export async function fetchMembers() {
  const response = await fetch(sai_members, {
    next: { revalidate: 3600 * 6 },
  });
  return response;
}
