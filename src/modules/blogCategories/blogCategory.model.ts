import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IBlogCategoryForm } from './blogCategory.interface';

const BlogCategorySchema = new Schema<IBlogCategoryForm>(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subcategories: [{ type: String, ref: 'BlogCategory' }],
  },
  { timestamps: true }
);

BlogCategorySchema.index({ name: 'text' });

export default mongoose.model<IBlogCategoryForm>(
  'BlogCategory',
  BlogCategorySchema
);
