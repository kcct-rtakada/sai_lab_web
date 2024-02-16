export interface Author {
  name: string;
}

export interface Tag {
  name: string;
}

export interface AdditionalImage {
  name: string;
}

export interface Link {
  name: string;
}

export default interface Project {
  id: string;
  classification: string;
  type: string;
  title: string;
  authors: Author[];
  tags: Tag[];
  bookTitle: string;
  volume: string;
  number: string;
  pageStart: number;
  pageEnd: number;
  date: Date;
  abstract: string;
  url: string;
  citation: string;
  paperUrl: string;
  thumbnailURL: string;
  presentationURL: string;
  additionalImageURL: AdditionalImage[];
}

export default interface News {
  id: string;
  date: Date;
  title: string;
  article: string;
  thumbnailURL: string;
  links: Link[];
  additionalImageURL: AdditionalImage[];
}

export default interface Member {
  id: string;
  name: string;
  englishName: string;
  belonging: string;
  classification: string;
  homepage: string;
  githubId: string
}

export default interface Award {
  id: string;
  organization: string;
  competition: string;
  award: string;
  person: string;
  date: Date;
  link: string;
}
