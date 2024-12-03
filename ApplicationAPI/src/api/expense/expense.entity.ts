import { Category } from '../category/category.entity';

export interface Expense {
  id?: string;
  userId: string;
  amount: number;
  category: string | Category;
  description?: string;
  date: Date;
}
