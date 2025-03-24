import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IBlog } from "./blog.interface";

const BlogSchema = new Schema<IBlog>(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: null },
    // Fix the reference setup
    category: [{ 
      type: Schema.Types.String,  // Đảm bảo loại này khớp với _id của DocumentCategory
      ref: "BlogCategory", 
      required: true 
    }],
    type: { type: String, enum: ["normal" , "popular"], default: "normal" },
  },
  { timestamps: true }
);

BlogSchema.index({ slug: 1 }, { unique: true }); 
BlogSchema.index({ category: 1 });

export default mongoose.model<IBlog>("Blog", BlogSchema);