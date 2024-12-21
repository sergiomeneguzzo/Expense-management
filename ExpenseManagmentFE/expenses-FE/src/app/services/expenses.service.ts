import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { apiUrl } from '../../../secrets';
import { Expense } from '../entities/expense';
import { Category } from '../entities/category';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  constructor(private http: HttpClient) {}

  getExpenses(): Observable<Expense[]> {
    return this.http.get<Expense[]>(`${apiUrl}/expenses`);
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${apiUrl}/expenses`, expense);
  }

  getCategoryExpenses(): Observable<Category[]> {
    return this.http.get<Category[]>(`${apiUrl}/categories`);
  }
}
