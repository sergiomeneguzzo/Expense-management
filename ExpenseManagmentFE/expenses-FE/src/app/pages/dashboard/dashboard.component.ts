import { Component, OnInit } from '@angular/core';
import { ExpensesService } from '../../services/expenses.service';
import { Expense } from '../../entities/expense';
import { Category } from '../../entities/category';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent implements OnInit {
  expenses: Expense[] = [];
  currentYearExpenses: Expense[] = [];
  recentExpenses: Expense[] = [];
  categories: Category[] = [];

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

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.initializeChart();
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

  loadExpenses(): void {
    this.loading = true;
    const currentYear = new Date().getFullYear();

    this.expensesService.getExpenses().subscribe(
      (data) => {
        this.expenses = data;

        this.currentYearExpenses = this.expenses.filter(
          (expense) => new Date(expense.date).getFullYear() === currentYear
        );

        this.recentExpenses = [...this.expenses]
          .sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
          )
          .slice(0, 4);
        this.calculateTotals();

        this.updateChart();
        console.log('Spese recuperate:', this.expenses);
        console.log("Spese dell'anno corrente:", this.currentYearExpenses);
        this.loading = false;
      },
      (error) => {
        console.error('Errore nel recuperare le spese', error);
        this.loading = false;
      }
    );
  }

  private calculateTotals(): void {
    const last30Days = this.getLast30Days();
    const previous30Days = this.getPrevious30Days();
    this.totalIncome = this.expenses
      .filter((expense) => expense.isIncome)
      .reduce((acc, expense) => acc + expense.amount, 0);
    this.totalExpenses = this.expenses
      .filter((expense) => !expense.isIncome)
      .reduce((acc, expense) => acc + expense.amount, 0);
    this.savings = this.totalIncome - this.totalExpenses;
    const incomeLast30 = this.calculateTotalForPeriod(last30Days, true);
    const incomePrevious30 = this.calculateTotalForPeriod(previous30Days, true);
    this.incomePercentage = this.calculatePercentageChange(
      incomeLast30,
      incomePrevious30
    );
    const expensesLast30 = this.calculateTotalForPeriod(last30Days, false);
    const expensesPrevious30 = this.calculateTotalForPeriod(
      previous30Days,
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
    const previous30Days = last30Days.map((date) => {
      const prevDate = new Date(date);
      prevDate.setDate(date.getDate() - 30);
      return prevDate;
    });
    return previous30Days;
  }
  private calculateTotalForPeriod(period: Date[], isIncome: boolean): number {
    return this.expenses
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
    if (previous === 0) return current > 0 ? 100 : 0;
    return ((current - previous) / previous) * 100;
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

    const monthlyExpenses = this.groupExpensesByMonth(this.currentYearExpenses);
    Object.keys(monthlyExpenses).forEach((month, index) => {
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
          backgroundColor: [primaryColor],
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
  }

  private updateChart(): void {
    const monthlyExpenses = this.groupExpensesByMonth(this.currentYearExpenses);
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
