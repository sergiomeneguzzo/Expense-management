import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Category } from '../../entities/category';
import { ExpensesService } from '../../services/expenses.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-add-modal',
  templateUrl: './add-modal.component.html',
  styleUrl: './add-modal.component.scss',
})
export class AddModalComponent {
  @Output() close = new EventEmitter<void>();
  categories: Category[] = [];

  transactionForm!: FormGroup;

  private touchStartY: number = 0;

  isIncomeOptions = [
    { label: 'Reddito', value: true },
    { label: 'Spesa', value: false },
  ];

  constructor(
    private fb: FormBuilder,
    private expensesService: ExpensesService,
    private notificationService: NotificationService
  ) {}

  ngOnInit() {
    this.transactionForm = this.fb.group({
      amount: [null, [Validators.required, Validators.min(1)]],
      category: [null, Validators.required],
      description: [''],
      date: [null, Validators.required],
      isIncome: [false, Validators.required],
    });
    this.loadCategories();
  }

  loadCategories(): void {
    this.expensesService.getCategoryExpenses().subscribe(
      (data) => {
        this.categories = data;
      },
      (error) => {
        console.error('Errore nel caricare le categorie', error);
      }
    );
  }

  onSubmit() {
    if (this.transactionForm.valid) {
      const formValue = this.transactionForm.value;
      const expense = {
        amount: formValue.amount,
        category: formValue.category.id,
        description: formValue.description,
        date: new Date(formValue.date) as Date,
        isIncome: formValue.isIncome,
      };

      console.log('Valore del campo date:', formValue.date);

      this.expensesService.addExpense(expense).subscribe(
        (response) => {
          console.log('Spesa aggiunta con successo', response);
          this.notificationService.successMessage(
            'Transazione aggiunta con successo',
            'Successo'
          );
          this.onClose();
        },
        (error) => {
          console.error("Errore nell'aggiungere la spesa", error);
          this.notificationService.errorMessage(
            'Errore nell’aggiungere la transazione. Riprova più tardi',
            'Errore'
          );
        }
      );
    } else {
      this.notificationService.warningMessage(
        'Per favore, completa correttamente tutti i campi obbligatori',
        'Attenzione'
      );
    }
  }

  onClose(): void {
    this.close.emit();
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStartY = event.touches[0].clientY;
  }

  onTouchEnd(event: TouchEvent): void {
    const touchEndY = event.changedTouches[0].clientY;
    const swipeDistance = touchEndY - this.touchStartY;

    if (swipeDistance > 50) {
      this.onClose();
    }
  }
}