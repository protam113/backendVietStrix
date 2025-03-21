import mongoose, { Schema, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

interface IContactForm extends Document {
    id: string;
    name: string;
    email: string;
    phone_number: string;
    message: string;
    link?: string | null;
    status: "pending" | "approved" | "rejected"; // 🆕 Thêm status
  }
  
  const ContactFormSchema = new Schema<IContactForm>(
    {
      id: { type: String, default: uuidv4 },
      name: { type: String, required: true },
      email: { type: String, required: true },
      phone_number: { type: String, required: true },
      message: { type: String, required: true },
      link: { type: String, default: null },
      status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" }, // 🆕 Định nghĩa status
    },
    { timestamps: true }
  );
// ⚡ Index để tối ưu truy vấn
ContactFormSchema.index({ email: 1 });
ContactFormSchema.index({ phone_number: 1 });
ContactFormSchema.index({ status: 1 }); // ✅ Thêm index cho status để lọc nhanh

export default mongoose.model<IContactForm>("ContactForm", ContactFormSchema);
