import {
  ChangeDetectorRef,
  Component,
  Input,
  OnChanges,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { Expense } from '../../entities/expense';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit, OnChanges {
  expenses: Expense[] = [];
  recentExpenses: Expense[] = [];
  loading: boolean = false;

  chartData: any;
  chartOptions: any;

  constructor(
    private expensesService: ExpensesService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.initializeChart();
  }

  ngOnChanges(): void {
    if (this.expenses.length > 0) {
      this.updateChart();
    }
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
          .slice(0, 4);
        this.updateChart();
        console.log('Spese recuperate', this.expenses);
        this.loading = false;
      },
      (error) => {
        console.error('Errore nel recuperare le spese', error);
        this.loading = false;
      }
    );
  }

  private initializeChart(): void {
    const months = [
      'GEN',
      'FEB',
      'MAR',
      'APR',
      'MAG',
      'GIU',
      'LUG',
      'AGO',
      'SET',
      'OTT',
      'NOV',
      'DIC',
    ];

    let monthlyData = new Array(12).fill(0);

    const monthlyExpenses = this.groupExpensesByMonth();
    Object.keys(monthlyExpenses).forEach((month, index) => {
      const monthIndex = months.indexOf(month);
      if (monthIndex !== -1) {
        monthlyData[monthIndex] = monthlyExpenses[month];
      }
    });

    this.chartData = {
      labels: months,
      datasets: [
        {
          label: 'Spese Mensili',
          backgroundColor: '#0ddc86',
          borderRadius: 5,
          data: monthlyData,
        },
      ],
    };

    this.chartOptions = {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          callbacks: {
            label: (context: any) => `€${context.raw}`,
          },
        },
      },
      scales: {
        x: {
          grid: {
            display: false,
          },
          ticks: {
            autoSkip: false,
          },
          barPercentage: 0.5,
        },
        y: {
          beginAtZero: true,
          grid: {
            borderColor: '#ddd',
          },
        },
      },
    };
  }

  private updateChart(): void {
    const monthlyExpenses = this.groupExpensesByMonth();
    const months = [
      'GEN',
      'FEB',
      'MAR',
      'APR',
      'MAG',
      'GIU',
      'LUG',
      'AGO',
      'SET',
      'OTT',
      'NOV',
      'DIC',
    ];

    let monthlyData = new Array(12).fill(0);

    Object.keys(monthlyExpenses).forEach((month) => {
      const monthIndex = months.indexOf(month);
      if (monthIndex !== -1) {
        monthlyData[monthIndex] = monthlyExpenses[month];
      }
    });

    this.chartData = {
      labels: months,
      datasets: [
        {
          label: 'Spese Mensili',
          backgroundColor: '#0ddc86',
          borderRadius: 5,
          data: monthlyData,
        },
      ],
    };
  }

  private groupExpensesByMonth(): Record<string, number> {
    return this.expenses
      .filter((expense) => !expense.isIncome)
      .reduce((acc, expense) => {
        const month = new Date(expense.date)
          .toLocaleString('it-IT', { month: 'short' })
          .replace('.', '')
          .toUpperCase();

        acc[month] = (acc[month] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);
  }
}
