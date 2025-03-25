import mongoose, { Schema, Document } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IDocumentCategoryForm } from './documentCategory.interface';

const DocumentCategorySchema = new Schema<IDocumentCategoryForm>(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // Đảm bảo rằng đây đã là unique
    subcategories: { type: [String], default: [] },
  },
  { timestamps: true }
);

// Để chỉ định index text cho trường `name`, bạn có thể giữ index này
DocumentCategorySchema.index({ name: 'text' });

export default mongoose.model<IDocumentCategoryForm>(
  'DocumentCategory',
  DocumentCategorySchema
);
