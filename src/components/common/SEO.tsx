import type { Metadata } from 'next';

export type Props = Record<'title' | 'description' | 'url' | 'imageUrl', string | undefined>;

export default function SEO(info: Props): Metadata {
  const { title, description, url, imageUrl } = info;
  const displayingTitle = title ? `${title} - SAI` : `SAI (神戸高専 髙田研究室)`;
  const displayingDescription = description ? description : '神戸市立工業高等専門学校 電子工学科 髙田研究室(SAI)';
  const displayingURL = url ? `https://sai.ac${url}` : 'https://sai.ac';
  const displayingImageURL = imageUrl ? imageUrl : 'https://sai.ac/colorful_icon.png';
  const metadata: Metadata = {
    title: displayingTitle,
    description: displayingDescription,
    icons: '/favicon.ico',
    keywords: ['SAI', '髙田 崚介', '高田 崚介', '神戸高専', '電子工学科'],
    manifest: '/manifest.json',
    openGraph: {
      // titleにサイト名は基本つけない
      title: title ? title : `SAI`,
      description: displayingDescription,
      url: displayingURL,
      siteName: 'SAI (神戸高専電子工学科 髙田研究室)',
      type: 'website',
      images: {
        url: displayingImageURL,
        width: 445,
        height: 445,
      },
    },
    twitter: {
      card: 'summary',
      images: [displayingImageURL],
    },
  };
  return metadata;
}
