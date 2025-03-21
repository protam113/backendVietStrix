import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IDocs extends Document {
  id: string; // UUID
  title: string;
  slug: string;
  content: string;
  description: string;
  link?: string | null;
  category: string; // ⚡ Dùng string nếu Category có UUID
}

const DocsSchema = new Schema<IDocs>(
  {
    id: { type: String, default: uuidv4 }, // ⚡ UUID thay vì ObjectId
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // ⚡ Giữ unique ở đây, KHÔNG cần index riêng
    content: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: null },
    category: { type: String, ref: "Category", required: true }, // ⚡ Dùng String nếu Category có UUID
  },
  { timestamps: true }
);

// ⚡ Chỉ giữ lại index cần thiết
DocsSchema.index({ category: 1 }); // Index cho category (tìm docs theo category)
DocsSchema.index({ title: "text", description: "text" }); // Text search cho title + description

export default mongoose.model<IDocs>("Docs", DocsSchema);
