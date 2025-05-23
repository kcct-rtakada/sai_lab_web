import { MetadataRoute } from 'next';
import { fetchNews, fetchProjects } from '@/components/GASFetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const projectList = await fetchProjects();

  const newsList = await fetchNews();

  const baseURL = 'https://sai.ac/';

  // 固定ページ
  const staticPaths = [
    {
      url: 'https://sai.ac',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'yearly',
      priority: 1.0,
    },
    {
      url: baseURL + 'award',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: baseURL + 'contact',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'yearly',
      priority: 0.8,
    },
    {
      url: baseURL + 'member',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'monthly',
      priority: 0.8,
    },
    {
      url: baseURL + 'news',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: baseURL + 'project',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: baseURL + 'publication',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: baseURL + 'thesis',
      lastModified: '2024-03-31T14:59:59.310Z',
      changeFrequency: 'weekly',
      priority: 0.8,
    },
  ];

  const dynamicPaths: any[] = [];

  // ニュースとプロジェクトのリストをsitemapに追加
  projectList.forEach((item) => {
    dynamicPaths.push({
      url: baseURL + 'project/' + item.id,
      lastModified: new Date(item.date).toISOString(),
      changeFrequency: 'weekly',
      priority: 0.7,
    });
  });

  newsList.forEach((item) => {
    dynamicPaths.push({
      url: baseURL + 'news/' + item.id,
      lastModified: new Date(item.date).toISOString(),
      changeFrequency: 'monthly',
      priority: 0.7,
    });
  });

  return [...staticPaths, ...dynamicPaths];
}
