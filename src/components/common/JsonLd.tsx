import { Article as JsonLDArticle, WebPage as JsonLDWebPage, WebSite as JsonLDWebSite, WithContext } from 'schema-dts';
import { PageMetadata } from '../PageMetadata';

export function getJsonLd(
  isArticle: boolean,
  name: string | undefined,
  description: string | undefined,
  url: string | undefined = '',
  structureType: 'WebPage' | 'WebSite' = 'WebPage',
): WithContext<JsonLDArticle | JsonLDWebPage | JsonLDWebSite> {
  if (structureType === 'WebSite') {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebSite',
      url: 'https://sai.ac/',
      name: 'SAI (神戸高専 髙田研究室)',
      alternateName: ['SAI', '神戸高専 髙田研究室', 'KCCT SAI'],
    };
  }

  const jsonLd: WithContext<JsonLDArticle | JsonLDWebPage> = {
    '@context': 'https://schema.org',
    '@type': isArticle ? 'Article' : 'WebPage',
    name: '神戸高専電子工学科 髙田研究室',
    alternateName: ['KCCT SAI'],
    headline: name ? `${name} - SAI` : 'SAI (髙田研究室)',
    description: description ?? '神戸高専電子工学科 髙田研究室 (SAI)',
    mainEntityOfPage: `https://sai.ac${url}`,
    url: `https://sai.ac${url}`,

    publisher: {
      '@type': 'Organization',
      name: 'SAI (神戸高専髙田研究室)',
      logo: {
        '@type': 'ImageObject',
        url: `https://sai.ac/colorful_icon.png`,
      },
    },
  };

  return jsonLd;
}

export function getJsonLdScript(jsonLd: WithContext<JsonLDArticle | JsonLDWebPage | JsonLDWebSite>) {
  return (
    <script key='json-ld' type='application/ld+json' dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
  );
}

export function generateWebsiteStructure(pageMeta: PageMetadata, structureType: 'WebPage' | 'WebSite' = 'WebPage') {
  return getJsonLdScript(
    getJsonLd(pageMeta.isArticle, pageMeta.title, pageMeta.description, pageMeta.url, structureType),
  );
}
