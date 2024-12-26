import { Component } from '@angular/core';
import { Expense } from '../../entities/expense';
import { Category } from '../../entities/category';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
})
export class SummaryComponent {
  expenses: Expense[] = [];
  categories: Category[] = [];
  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  expensesByCategory: { category: string; total: number; items: Expense[] }[] =
    [];
  loading: boolean = false;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategories();
  }

  loadExpenses(): void {
    this.loading = true;
    this.expensesService.getExpenses().subscribe(
      (data) => {
        this.expenses = data;
        this.updateExpensesByCategory();
        this.loading = false;
      },
      (error) => {
        console.error('Errore nel recuperare le spese', error);
      }
    );
  }

  loadCategories(): void {
    this.loading = true;
    this.expensesService.getCategoryExpenses().subscribe(
      (data) => {
        this.categories = data;
        if (this.expenses.length > 0) {
          this.updateExpensesByCategory();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Errore nel recuperare le categorie', error);
      }
    );
  }

  getMonthlySummary(): { income: number; expenses: number; balance: number } {
    const monthExpenses = this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === this.currentMonth &&
        expenseDate.getFullYear() === this.currentYear
      );
    });

    const income = monthExpenses
      .filter((expense) => expense.isIncome)
      .reduce((sum, expense) => sum + expense.amount, 0);

    const expenses = monthExpenses
      .filter((expense) => !expense.isIncome)
      .reduce((sum, expense) => sum + expense.amount, 0);

    return {
      income,
      expenses,
      balance: income - expenses,
    };
  }

  updateExpensesByCategory(): void {
    const filteredExpenses = this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === this.currentMonth &&
        expenseDate.getFullYear() === this.currentYear
      );
    });

    const groupedByCategory = filteredExpenses.reduce((acc, expense) => {
      const category = this.categories.find(
        (cat) => cat.id === expense.category.id
      );
      const categoryName = category ? category.name : 'Sconosciuto';

      if (!acc[categoryName]) {
        acc[categoryName] = { total: 0, items: [] };
      }

      acc[categoryName].total += expense.amount * (expense.isIncome ? 1 : 1);
      acc[categoryName].items.push(expense);

      return acc;
    }, {} as Record<string, { total: number; items: Expense[] }>);

    this.expensesByCategory = Object.entries(groupedByCategory).map(
      ([category, { total, items }]) => ({
        category,
        total,
        items,
      })
    );
  }

  changeMonth(direction: number): void {
    this.currentMonth += direction;
    if (this.currentMonth < 0) {
      this.currentMonth = 11;
      this.currentYear--;
    } else if (this.currentMonth > 11) {
      this.currentMonth = 0;
      this.currentYear++;
    }
    this.updateExpensesByCategory();
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString(
      'default',
      {
        month: 'long',
      }
    );
  }
}
