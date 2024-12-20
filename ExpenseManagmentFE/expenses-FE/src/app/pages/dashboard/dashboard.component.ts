import { Component } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { Expense } from '../../entities/expense';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  expenses: Expense[] = [];
  recentExpenses: Expense[] = [];
  loading: boolean = false;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.loadExpenses();
  }

  loadExpenses(): void {
    this.loading = true;
    this.expensesService.getExpenses().subscribe(
      (data) => {
        this.expenses = data;
        this.recentExpenses = [...this.expenses]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5);
        console.log('Spese recuperate', this.expenses);
        this.loading = false;
      },
      (error) => {
        console.error('Errore nel recuperare le spese', error);
        this.loading = false;
      }
    );
  }
}
