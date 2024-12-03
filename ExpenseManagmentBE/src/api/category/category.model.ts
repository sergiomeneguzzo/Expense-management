import mongoose from 'mongoose';
import { Category as iCategory } from './category.entity';

export const categorySchema = new mongoose.Schema<iCategory>({
  name: { type: String, required: true, unique: true },
  description: { type: String },
});

categorySchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const CategoryModel = mongoose.model<iCategory>(
  'Category',
  categorySchema,
);
