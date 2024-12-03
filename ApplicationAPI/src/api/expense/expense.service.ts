import { ExpenseModel } from './expense.model';
import { Expense } from './expense.entity';

const getAllExpenses = async (userId: string) => {
  return ExpenseModel.find({ userId }).populate('category').sort({ date: -1 });
};

const createExpense = async (expense: Expense) => {
  return ExpenseModel.create(expense);
};

const updateExpense = async (id: string, updatedExpense: Partial<Expense>) => {
  return ExpenseModel.findByIdAndUpdate(id, updatedExpense, { new: true });
};

const deleteExpense = async (id: string) => {
  return ExpenseModel.findByIdAndDelete(id);
};

export default {
  getAllExpenses,
  createExpense,
  updateExpense,
  deleteExpense,
};
