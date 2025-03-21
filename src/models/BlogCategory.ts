import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import thư viện UUID

interface BlogCategory extends Document {
  _id: string; // UUID thay vì ObjectId
  name: string;
  slug: string;
  subcategories?: string[]; // Danh sách ID của subcategories
}

const BlogCategorySchema = new Schema<BlogCategory>(
  {
    _id: { type: String, default: uuidv4 }, // 🆕 Định nghĩa _id là UUID
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    subcategories: [{ type: String, ref: "BlogCategory" }], // 🔗 Liên kết tới chính nó
  },
  { timestamps: true }
);

// 🏆 Chỉ giữ lại index hợp lệ
BlogCategorySchema.index({ name: "text" }); // Hỗ trợ tìm kiếm theo name

export default mongoose.model<BlogCategory>("BlogCategory", BlogCategorySchema);
