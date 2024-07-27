import {
  Article as JsonLDArticle,
  WebPage as JsonLDWebPage,
  WithContext,
} from 'schema-dts';

export function getJsonLd(isArticle: boolean, name: string, description: string, url: string = ""): WithContext<JsonLDArticle | JsonLDWebPage> {

  const jsonLd: WithContext<JsonLDArticle | JsonLDWebPage> = {
    '@context': 'https://schema.org',
    '@type': isArticle ? 'Article' : 'WebPage',
    name: "SAI (髙田研究室)",
    alternateName: "神戸高専 髙田研究室",
    headline: name,
    description,
    mainEntityOfPage: `https://sai.ac${url}`,
    url: "https://sai.ac",

    publisher: {
      '@type': 'Organization',
      name: 'SAI (神戸高専 髙田研究室)',
      logo: {
        '@type': 'ImageObject',
        url: `https://sai.ac/colorful_icon.png`,
      },
    }
  }

  return jsonLd;
}

export function getJsonLdScript(jsonLd: WithContext<JsonLDArticle | JsonLDWebPage>) {
  return <script
    key="json-ld"
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
  />
}