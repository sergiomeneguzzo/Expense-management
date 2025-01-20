import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ExpensesService } from '../../services/expenses.service';
import { Expense } from '../../entities/expense';
import { Category } from '../../entities/category';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  expenses$: Observable<Expense[]>;
  currentYearExpenses$: Observable<Expense[]>;
  recentExpenses$: Observable<Expense[]>;

  totalIncome: number = 0;
  totalExpenses: number = 0;
  savings: number = 0;
  incomePercentage: number = 0;
  expensePercentage: number = 0;
  savingsPercentage: number = 0;

  loading: boolean = false;
  modalVisible: boolean = false;

  chartData: any;
  chartOptions: any;

  tabs = [
    { label: 'QUADRO GENERALE' },
    { label: 'QUESTO MESE' },
    { label: 'ELENCO' },
  ];
  activeTab = 0;

  constructor(private expensesService: ExpensesService) {
    this.expenses$ = this.expensesService.expenses$;

    const currentYear = new Date().getFullYear();
    this.currentYearExpenses$ = this.expenses$.pipe(
      map((expenses) =>
        expenses.filter(
          (expense) => new Date(expense.date).getFullYear() === currentYear
        )
      )
    );
    this.recentExpenses$ = this.expenses$.pipe(
      map((expenses) =>
        expenses
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 5)
      )
    );
  }

  ngOnInit(): void {
    this.expensesService.loadExpenses();
    this.initializeChart();
    this.calculateTotals();
  }

  selectTab(index: number): void {
    this.activeTab = index;
  }

  onAddButtonClick(): void {
    this.modalVisible = !this.modalVisible;
  }

  onCloseScreen(): void {
    this.modalVisible = false;
  }

  private calculateTotals(): void {
    this.expenses$.subscribe((expenses) => {
      const last30Days = this.getLast30Days();
      const previous30Days = this.getPrevious30Days();

      this.totalIncome = expenses
        .filter((expense) => expense.isIncome)
        .reduce((acc, expense) => acc + expense.amount, 0);

      this.totalExpenses = expenses
        .filter((expense) => !expense.isIncome)
        .reduce((acc, expense) => acc + expense.amount, 0);

      this.savings = this.totalIncome - this.totalExpenses;

      const incomeLast30 = this.calculateTotalForPeriod(
        last30Days,
        expenses,
        true
      );
      const incomePrevious30 = this.calculateTotalForPeriod(
        previous30Days,
        expenses,
        true
      );

      this.incomePercentage = this.calculatePercentageChange(
        incomeLast30,
        incomePrevious30
      );

      const expensesLast30 = this.calculateTotalForPeriod(
        last30Days,
        expenses,
        false
      );
      const expensesPrevious30 = this.calculateTotalForPeriod(
        previous30Days,
        expenses,
        false
      );

      this.expensePercentage = this.calculatePercentageChange(
        expensesLast30,
        expensesPrevious30
      );

      const savingsLast30 = incomeLast30 - expensesLast30;
      const savingsPrevious30 = incomePrevious30 - expensesPrevious30;

      this.savingsPercentage = this.calculatePercentageChange(
        savingsLast30,
        savingsPrevious30
      );

      this.updateChart(expenses);
    });
  }

  private getLast30Days(): Date[] {
    const today = new Date();
    const last30Days = [];
    for (let i = 0; i < 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      last30Days.push(date);
    }
    return last30Days;
  }

  private getPrevious30Days(): Date[] {
    const last30Days = this.getLast30Days();
    return last30Days.map((date) => {
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - 30);
      return prevDate;
    });
  }

  private calculateTotalForPeriod(
    period: Date[],
    expenses: Expense[],
    isIncome: boolean
  ): number {
    return expenses
      .filter((expense) => {
        const expenseDate = new Date(expense.date);
        return (
          period.some(
            (date) => date.toDateString() === expenseDate.toDateString()
          ) && expense.isIncome === isIncome
        );
      })
      .reduce((acc, expense) => acc + expense.amount, 0);
  }

  private calculatePercentageChange(current: number, previous: number): number {
    if (previous === 0) {
      return current > 0 ? 100 : 0;
    }
    const percentage = ((current - previous) / previous) * 100;

    return Math.min(Math.max(percentage, 0), 100);
  }

  private initializeChart(): void {
    this.currentYearExpenses$.subscribe((expenses) => {
      const monthlyExpenses = this.groupExpensesByMonth(expenses);
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

      const primaryColor = getComputedStyle(document.documentElement)
        .getPropertyValue('--primary-color-light')
        .trim();

      this.chartData = {
        labels: months,
        datasets: [
          {
            label: 'Spese Mensili',
            backgroundColor: primaryColor,
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
            display: false,
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
    });
  }

  private updateChart(expenses: Expense[]): void {
    const monthlyExpenses = this.groupExpensesByMonth(expenses);
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

    const currentYear = new Date().getFullYear();
    const currentYearMonthlyExpenses = this.groupExpensesByMonth(
      expenses.filter(
        (expense) => new Date(expense.date).getFullYear() === currentYear
      )
    );

    Object.keys(currentYearMonthlyExpenses).forEach((month) => {
      const monthIndex = months.indexOf(month);
      if (monthIndex !== -1) {
        monthlyData[monthIndex] = currentYearMonthlyExpenses[month];
      }
    });

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color-light')
      .trim();

    this.chartData = {
      labels: months,
      datasets: [
        {
          label: 'Spese Mensili',
          backgroundColor: primaryColor,
          borderRadius: 5,
          data: monthlyData,
        },
      ],
    };
  }

  private groupExpensesByMonth(expenses: Expense[]): Record<string, number> {
    return expenses
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
