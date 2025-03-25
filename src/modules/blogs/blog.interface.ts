export interface IBlog {
  _id: string;
  title: string;
  slug: string;
  content: string;
  description: string;
  link?: string | null;
  type: 'normal' | 'popular';
  category: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
