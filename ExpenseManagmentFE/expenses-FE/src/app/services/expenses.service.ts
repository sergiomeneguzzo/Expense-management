import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { apiUrl } from '../../../secrets';
import { Expense } from '../entities/expense';
import { Category } from '../entities/category';

@Injectable({
  providedIn: 'root',
})
export class ExpensesService {
  private expensesSubject = new BehaviorSubject<Expense[]>([]);
  expenses$ = this.expensesSubject.asObservable();

  constructor(private http: HttpClient) {}

  loadExpenses(): void {
    this.http.get<Expense[]>(`${apiUrl}/expenses`).subscribe({
      next: (data) => this.expensesSubject.next(data),
      error: (err) => console.error('Errore nel recuperare le spese:', err),
    });
  }

  addExpense(expense: Expense): Observable<Expense> {
    return this.http.post<Expense>(`${apiUrl}/expenses`, expense).pipe(
      tap((newExpense) => {
        const currentExpenses = this.expensesSubject.value;
        this.expensesSubject.next([...currentExpenses, newExpense]);
      })
    );
  }

  updateExpense(id: string, expense: Partial<Expense>): Observable<Expense> {
    return this.http.patch<Expense>(`${apiUrl}/expenses/${id}`, expense).pipe(
      tap((updatedExpense) => {
        const currentExpenses = this.expensesSubject.value.map((e) =>
          e.id === id ? { ...e, ...updatedExpense } : e
        );
        this.expensesSubject.next(currentExpenses);
      })
    );
  }

  deleteExpense(id: string): Observable<void> {
    return this.http.delete<void>(`${apiUrl}/expenses/${id}`).pipe(
      tap(() => {
        const currentExpenses = this.expensesSubject.value.filter(
          (e) => e.id !== id
        );
        this.expensesSubject.next(currentExpenses);
      })
    );
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
