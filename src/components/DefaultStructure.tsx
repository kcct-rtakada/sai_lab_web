export interface Author {
  name: string
}

export interface AdditionalImage {
  url: string
}

export default interface Project {
  id: number;
  type: string;
  title: string;
  authors: Author[];
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

export default interface Member {
  id: number;
  name: string;
  englishName: string;
  belonging: string;
  classification: string;
}