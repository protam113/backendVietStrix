import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IDocumentForm } from "./document.interface";

const DocumentSchema = new Schema<IDocumentForm>(
  {
    _id: { type: String, default: uuidv4 },
    title: { type: String, required: true },
    slug: { type: String, required: true },
    content: { type: String, required: true },
    description: { type: String, required: true },
    link: { type: String, default: null },
    // Fix the reference setup
    category: { 
      type: Schema.Types.String,  // Make sure this matches DocumentCategory _id type
      ref: "DocumentCategory", 
      required: true 
    },
  },
  { timestamps: true }
);

DocumentSchema.index({ slug: 1 }, { unique: true }); 
DocumentSchema.index({ category: 1 });

export default mongoose.model<IDocumentForm>("Document", DocumentSchema);