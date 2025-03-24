import mongoose, { Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { IContactForm } from "./contact.interface";

const ContactFormSchema = new Schema<IContactForm>(
  {
    _id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    email: { type: String, required: true },
    phone_number: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: null },
    status: { type: String, enum: ["pending", "approved", "rejected"], default: "pending" },
  },
  { timestamps: true }
);

export default mongoose.model<IContactForm>("ContactForm", ContactFormSchema);
