import { Component } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  expenses: any[] = [];
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
