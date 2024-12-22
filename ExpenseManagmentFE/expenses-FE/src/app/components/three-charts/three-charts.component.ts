import { Component } from '@angular/core';
import { Category } from '../../entities/category';
import { Expense } from '../../entities/expense';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-three-charts',
  templateUrl: './three-charts.component.html',
  styleUrl: './three-charts.component.scss',
})
export class ThreeChartsComponent {
  expenses: Expense[] = [];
  categories: Category[] = [];

  pieChartData: any;
  pieChartOptions: any;

  constructor(private expensesService: ExpensesService) {}

  ngOnInit(): void {
    this.loadExpenses();
    this.loadCategories();
  }

  ngOnChanges(): void {
    if (this.expenses.length > 0) {
      this.updatePieChart();
    }
  }

  //GRAFICO TORTA
  private updatePieChart(): void {
    const groupedByCategory = this.groupExpensesByCategory();
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
            primaryColorLight,
            primaryColor,
            primaryColorDark,
            primaryColorDarker,
          ],
        },
      ],
    };

    this.pieChartOptions = {
      responsive: true,
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

  private groupExpensesByCategory(): Record<string, number> {
    return this.expenses
      .filter((expense) => !expense.isIncome)
      .reduce((acc, expense) => {
        const categoryId = expense.category.id!;
        acc[categoryId] = (acc[categoryId] || 0) + expense.amount;
        return acc;
      }, {} as Record<string, number>);
  }

  //caricamento dati
  loadExpenses(): void {
    this.expensesService.getExpenses().subscribe(
      (data) => {
        this.expenses = data;
        this.updatePieChart();
      },
      (error) => {
        console.error('Errore nel recuperare le spese', error);
      }
    );
  }
  loadCategories(): void {
    this.expensesService.getCategoryExpenses().subscribe(
      (data) => {
        this.categories = data;
        if (this.expenses.length > 0) {
          this.updatePieChart();
        }
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
}
