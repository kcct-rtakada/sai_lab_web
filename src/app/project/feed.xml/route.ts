import RSS from 'rss';
import { fetchProjects } from '@/components/GASFetch';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export async function GET() {
  const feed = new RSS({
    title: 'SAI(髙田研究室) プロジェクト',
    description: 'SAI(髙田研究室)によるプロジェクト',
    site_url: 'https://sai.ac',
    feed_url: 'https://sai.ac/project/feed.xml',
    copyright: 'sai',
    language: 'ja',
    pubDate: new Date().toISOString(),
  });

  const projectList = await fetchProjects();

  projectList.forEach((project) => {
    const plainText = project.abstract.replaceAll('\\n+', ' ');

    feed.item({
      title: project.title,
      description: plainText.length > 100 ? plainText.substring(0, 99) + '...' : plainText,
      url: `https://sai.ac/project/${project.id}`,
      date: new Date(project.date),
    });
  });

  return new Response(feed.xml({ indent: true }), {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
    },
  });
}
