import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { Category } from '../../entities/category';
import { Expense } from '../../entities/expense';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-three-charts',
  templateUrl: './three-charts.component.html',
  styleUrl: './three-charts.component.scss',
})
export class ThreeChartsComponent implements OnInit {
  @ViewChild('chartElement', { static: false }) chartElement!: ElementRef;
  @ViewChild('lineChart', { static: false }) lineChart: any;
  @ViewChild('pieChart', { static: false }) pieChart: any;

  expenses: Expense[] = [];
  categories: Category[] = [];

  salaryUsedPercentage: number = 0;
  loading: boolean = false;

  currentYear: number = new Date().getFullYear();
  currentMonth: number = new Date().getMonth();
  daysInMonth: { day: number; amount: number; isToday: boolean }[] = [];

  pieChartData: any;
  pieChartOptions: any;
  lineChartData: any;
  lineChartOptions: any;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategories();
    this.generateCalendar();
  }

  ngAfterViewInit(): void {
    this.initIntersectionObserver();
  }

  private initIntersectionObserver() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          this.triggerChartAnimations();
        }
      });
    });

    const charts = document.querySelectorAll('.chart-card');
    charts.forEach((chart) => {
      observer.observe(chart);
    });
  }

  private triggerChartAnimations() {
    if (this.lineChart) {
      this.lineChart.chart.update();
    }
    if (this.pieChart) {
      this.pieChart.chart.update();
    }
  }

  //GRAFICO TORTA
  private updatePieChart(): void {
    const currentMonthExpenses = this.filterExpensesByCurrentMonth();
    const groupedByCategory = currentMonthExpenses.reduce((acc, expense) => {
      const categoryId = expense.category?.id || 'Sconosciuto';
      acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
      return acc;
    }, {} as Record<string, number>);
    const topCategories = Object.entries(groupedByCategory)
      .sort(([, amountA], [, amountB]) => amountB - amountA)
      .slice(0, 4);
    const labels = topCategories.map(([categoryId, _]) => {
      const category = this.categories.find((cat) => cat.id === categoryId);
      return category ? category.name : 'Sconosciuto';
    });
    const data = topCategories.map(([_, amount]) => amount);
    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color')
      .trim();
    const primaryColorLight = this.adjustColorBrightness(primaryColor, 20);
    const primaryColorDark = this.adjustColorBrightness(primaryColor, -40);
    const primaryColorDarker = this.adjustColorBrightness(primaryColor, -70);
    this.pieChartData = {
      labels: labels,
      datasets: [
        {
          data: data,
          backgroundColor: [
            primaryColor,
            primaryColorLight,
            primaryColorDark,
            primaryColorDarker,
          ],
        },
      ],
    };
    this.pieChartOptions = {
      responsive: true,
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart',
      },
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
    };
  }

  //GRAFICO LINEARE
  private updateLineChart(): void {
    const currentMonthExpenses = this.filterExpensesByCurrentMonth();
    const daysOfMonth = Array.from({ length: 31 }, (_, i) => i + 1);
    const dailyExpenses = daysOfMonth.map((day) => {
      const dailyTotal = currentMonthExpenses
        .filter((expense) => new Date(expense.date).getDate() === day)
        .reduce((acc, expense) => acc + expense.amount, 0);
      return dailyTotal;
    });

    const primaryColor = getComputedStyle(document.documentElement)
      .getPropertyValue('--primary-color-light')
      .trim();
    this.lineChartData = {
      labels: daysOfMonth.map((day) => `${day}`),
      datasets: [
        {
          label: 'Spese giornaliere',
          data: dailyExpenses,
          fill: false,
          borderColor: primaryColor,
          tension: 0.4,
          borderWidth: 3,
          pointRadius: 0,
        },
      ],
    };

    this.lineChartOptions = {
      responsive: true,
      animation: {
        duration: 1500,
        easing: 'easeInOutQuart',
      },
      plugins: {
        tooltip: {
          enabled: true,
          callbacks: {
            label: (context: any) => `€${context.raw}`,
          },
          intersect: false,
          position: 'nearest',
          mode: 'nearest',
          caretSize: 6,
          bodyFont: {
            size: 12,
          },
        },
        legend: {
          display: false,
        },
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Giorni',
          },
          grid: {
            display: false,
          },
          ticks: {
            maxRotation: 0,
            minRotation: 0,
          },
        },
        y: {
          title: {
            display: true,
            text: 'Importo (€)',
          },
          grid: {
            display: false,
          },
        },
      },
    };
  }
  private filterExpensesByCurrentMonth(): Expense[] {
    const currentDate = new Date();
    return this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear() &&
        !expense.isIncome
      );
    });
  }

  //PROGRESS BAR
  private updateSalaryUsedPercentage(): void {
    const salaryExpenses = this.filterSalaryExpensesByMonth();
    const totalSalary = salaryExpenses.reduce(
      (acc, expense) => acc + expense.amount,
      0
    );
    const totalExpenses = this.expenses
      .filter((expense) => !expense.isIncome)
      .reduce((acc, expense) => acc + expense.amount, 0);

    if (totalSalary > 0) {
      this.salaryUsedPercentage = Math.round(
        (totalExpenses / totalSalary) * 100
      );
      if (this.salaryUsedPercentage > 100) {
        this.salaryUsedPercentage = 100;
      }
    } else {
      this.salaryUsedPercentage = 0;
    }
  }

  private filterSalaryExpensesByMonth(): Expense[] {
    const currentDate = new Date();
    return this.expenses.filter((expense) => {
      const expenseDate = new Date(expense.date);
      return (
        expense.isIncome &&
        expenseDate.getMonth() === currentDate.getMonth() &&
        expenseDate.getFullYear() === currentDate.getFullYear()
      );
    });
  }

  loadExpenses(): void {
    this.loading = true;
    this.expensesService.getExpenses().subscribe(
      (data) => {
        this.expenses = data;
        this.updatePieChart();
        this.updateLineChart();
        this.updateSalaryUsedPercentage();
        this.generateCalendar();
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
          this.updatePieChart();
          this.updateLineChart();
          this.updateSalaryUsedPercentage();
        }
        this.loading = false;
      },
      (error) => {
        console.error('Errore nel recuperare le categorie', error);
      }
    );
  }
  private adjustColorBrightness(color: string, percent: number): string {
    let r: any, g: any, b: any;
    color = color.replace('#', '');
    r = parseInt(color.substring(0, 2), 16);
    g = parseInt(color.substring(2, 4), 16);
    b = parseInt(color.substring(4, 6), 16);
    r = Math.round((r * (100 + percent)) / 100);
    g = Math.round((g * (100 + percent)) / 100);
    b = Math.round((b * (100 + percent)) / 100);
    r = r > 255 ? 255 : r < 0 ? 0 : r;
    g = g > 255 ? 255 : g < 0 ? 0 : g;
    b = b > 255 ? 255 : b < 0 ? 0 : b;
    return `#${((1 << 24) | (r << 16) | (g << 8) | b)
      .toString(16)
      .slice(1)
      .toUpperCase()}`;
  }

  get currentMonthName(): string {
    return new Date(this.currentYear, this.currentMonth).toLocaleString(
      'default',
      { month: 'long' }
    );
  }

  generateCalendar(): void {
    this.daysInMonth = [];
    const days = new Date(this.currentYear, this.currentMonth + 1, 0).getDate();

    for (let i = 1; i <= days; i++) {
      const dateStr = `${this.currentYear}-${String(
        this.currentMonth + 1
      ).padStart(2, '0')}-${String(i).padStart(2, '0')}T12:00:00`;

      const dayExpenses = this.expenses.filter((expense) => {
        const expenseDate = new Date(expense.date);
        const expenseDay = expenseDate.getDate();
        const expenseMonth = expenseDate.getMonth();
        const expenseYear = expenseDate.getFullYear();

        return (
          expenseDay === i &&
          expenseMonth === this.currentMonth &&
          expenseYear === this.currentYear &&
          !expense.isIncome
        );
      });

      const totalAmount = dayExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      );

      const today = new Date();
      const isToday =
        today.getDate() === i &&
        today.getMonth() === this.currentMonth &&
        today.getFullYear() === this.currentYear;

      this.daysInMonth.push({
        day: i,
        amount: totalAmount,
        isToday: isToday,
      });
    }
  }

  abbreviateNumber(value: number): string {
    if (value >= 1000) {
      return (value / 1000).toFixed(1).replace('.0', '') + 'k';
    }
    return value.toString();
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
    this.generateCalendar();
  }
}
