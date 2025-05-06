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

export interface ProjectObject {
  name: string;
}

export interface Project {
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
  presentationHTML: string;
  documentHTML: string;
  posterHTML: string;
  freeHTML: string;
  additionalImageURL: AdditionalImage[];
}

export interface Publication {
  id: string;
  classification: string;
  author: string;
  title: string;
  publisher: string;
  date: Date;
  url: string;
  additionalURL: string;
}

export interface News {
  id: string;
  date: Date;
  title: string;
  article: string;
  thumbnailURL: string;
  links: Link[];
  additionalImageURL: AdditionalImage[];
}

export interface Member {
  id: string;
  name: string;
  englishName: string;
  otherName: string;
  belonging: string;
  classification: string;
  homepage: string;
  githubId: string;
}

export interface Award {
  id: string;
  organization: string;
  competition: string;
  award: string;
  person: string;
  date: Date;
  link: string;
}

export interface Fund {
  id: string;
  fund_system: string;
  topic: string;
  investigator: string;
  co_investigator: string;
  tags: Tag[];
  term: string;
  amount: string;
  url: string;
  projects: ProjectObject[];
}
