import { Component, EventEmitter, Inject, Input, Output } from '@angular/core';
import {
  FormGroup,
  FormBuilder,
  Validators,
  FormControl,
} from '@angular/forms';
import { Expense } from '../../entities/expense';
import { ExpensesService } from '../../services/expenses.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-expense-detail',
  templateUrl: './expense-detail.component.html',
  styleUrl: './expense-detail.component.scss',
})
export class ExpenseDetailComponent {
  @Input() visible: boolean = false;
  @Input() expense!: Expense;
  @Output() visibleChange = new EventEmitter<boolean>();
  @Output() expenseUpdated = new EventEmitter<Expense>();

  expenseForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private notificationService: NotificationService
  ) {
    this.expenseForm = this.fb.group({
      description: ['', Validators.required],
      amount: new FormControl(0, [Validators.required, Validators.min(1)]),
      date: [new Date(), Validators.required],
      isIncome: [false],
    });
  }

  ngOnChanges() {
    if (this.expense) {
      this.expenseForm.patchValue({
        description: this.expense.description,
        amount: this.expense.amount,
        date: new Date(this.expense.date),
        isIncome: this.expense.isIncome,
      });
    }
  }

  hideDialog() {
    this.visible = false;
    this.visibleChange.emit(false);
  }

  onSubmit() {
    if (this.expenseForm.valid) {
      const updatedExpense: Partial<Expense> = {
        ...this.expenseForm.value,
        date: this.expenseForm.value.date.toISOString(),
      };

      this.expensesService
        .updateExpense(this.expense.id!, updatedExpense)
        .subscribe({
          next: (result) => {
            this.expenseUpdated.emit(result);
            this.hideDialog();
            this.notificationService.successMessage(
              'Transazione aggiornata con successo'
            );
          },
          error: (error) => {
            this.notificationService.errorMessage(
              'Impossibile aggiornare la transazione'
            );
            console.error('Error updating expense:', error);
          },
        });
    }
  }

  deleteExpense() {
    this.expensesService.deleteExpense(this.expense.id!).subscribe({
      next: () => {
        this.expenseUpdated.emit(undefined);
        this.hideDialog();
        this.notificationService.successMessage(
          'Transazione eliminata con successo'
        );
      },
      error: (error) => {
        this.notificationService.errorMessage(
          'Impossibile eliminare la transazione'
        );
        console.error('Error deleting expense:', error);
      },
    });
  }
}
