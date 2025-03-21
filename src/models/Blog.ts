import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IBlog extends Document {
  _id: string; // UUID
  title: string;
  slug: string;
  content: string;
  description: string;
  link?: string | null;
  categories: string[]; // ⚡ Nhiều category (dùng UUID)
}

const BlogsSchema = new Schema<IBlog>(
  {
    _id: { type: String, default: uuidv4 }, // ⚡ UUID thay vì ObjectId
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true }, // ⚡ Unique slug
    content: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: null },
    categories: [{ type: String, ref: "BlogCategory", required: true }], // ⚡ Chuyển thành mảng
  },
  { timestamps: true }
);

// ⚡ Cải tiến Index
BlogsSchema.index({ categories: 1 }); // Index tìm blog theo category nhanh hơn
BlogsSchema.index({ title: "text", description: "text" }); // Tìm kiếm text cho title + description

export default mongoose.model<IBlog>("Blogs", BlogsSchema);
