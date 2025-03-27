// blogCategory.interface.ts

export interface IBlogCategoryForm {
  _id: string;
  name: string;
  slug: string;
  subcategories?: string[];
  type: 'normal' | 'popular';
}
