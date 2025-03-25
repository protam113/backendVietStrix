export interface IDocumentForm {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  link?: string | null;
  category: string;
  createdAt?: Date;
  updatedAt?: Date;
}
