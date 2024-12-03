import mongoose from 'mongoose';
import { Expense as iExpense } from './expense.entity';

export const expenseSchema = new mongoose.Schema<iExpense>({
  userId: { type: String, ref: 'User', required: true },
  amount: { type: Number, required: true },
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  description: { type: String },
  date: { type: Date, default: Date.now },
});

expenseSchema.set('toJSON', {
  virtuals: true,
  transform: (_, ret) => {
    delete ret._id;
    delete ret.__v;
    return ret;
  },
});

export const ExpenseModel = mongoose.model<iExpense>('Expense', expenseSchema);
