// blogCategory.model.ts
import mongoose, { Schema } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import { IFaq } from './faq.interface';

const FaqSchema = new Schema<IFaq>(
  {
    _id: { type: String, default: uuidv4 },
    question: { type: String, required: true },
    answer: { type: String, required: true, unique: true },
    status: { type: String, enum: ['show', 'hide'], default: 'show' },
  },
  { timestamps: true }
);

FaqSchema.index({ question: 'text', answer: 'text' });
FaqSchema.index({ status: 1 });
FaqSchema.index({ createdAt: -1 });

export default mongoose.model<IFaq>('Faq', FaqSchema);
