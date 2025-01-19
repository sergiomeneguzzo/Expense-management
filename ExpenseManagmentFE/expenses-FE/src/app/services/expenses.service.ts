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

  updateExpense(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.http.patch<Expense>(`${apiUrl}/expenses/${id}`, expense);
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/expenses/${id}`);
  }

  getCategoryExpenses(): Observable<Category[]> {
    return this.http.get<Category[]>(`${apiUrl}/categories`);
  }

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', 'ml_default');

    return this.http.post(
      'https://api.cloudinary.com/v1_1/dtizmgqqa/image/upload',
      formData
    );
  }
}
