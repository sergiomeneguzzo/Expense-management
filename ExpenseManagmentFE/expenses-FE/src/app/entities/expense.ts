import { Category } from './category';

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: Category;
  description?: string;
  date: Date;
  isIncome: boolean;
}
