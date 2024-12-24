import { Category } from './category';

export interface Expense {
  id?: string;
  amount: number;
  category: Category;
  description?: string;
  date: Date;
  isIncome: boolean;
}
