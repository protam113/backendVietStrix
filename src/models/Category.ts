import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid"; // Import thư viện UUID

interface ICategory extends Document {
  _id: string; // UUID thay vì ObjectId
  name: string;
  slug: string;
  subcategories?: string[]; // Danh sách subcategories dạng string
}

const CategorySchema = new Schema<ICategory>(
  {
    _id: { type: String, default: uuidv4 }, // 🆕 Định nghĩa _id là UUID
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // ⚡ Giữ unique ở đây, KHÔNG cần index riêng
    subcategories: { type: [String], default: [] },
  },
  { timestamps: true }
);

// 🏆 Chỉ giữ lại index hợp lệ
CategorySchema.index({ name: "text" }); // Hỗ trợ tìm kiếm theo name

export default mongoose.model<ICategory>("Category", CategorySchema);
