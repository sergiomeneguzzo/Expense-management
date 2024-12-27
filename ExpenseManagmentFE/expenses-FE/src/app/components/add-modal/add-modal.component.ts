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
  @Input() isOpen: boolean = false;

  categories: Category[] = [];

  transactionForm!: FormGroup;

  loading: boolean = false;

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
      isIncome: [null, Validators.required],
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

      if (
        formValue.category.name === 'Stipendio' &&
        !formValue.isIncome.value
      ) {
        this.notificationService.warningMessage(
          'Hai selezionato la categoria "Stipendio" con il tipo di transazione "Spesa". Si consiglia di scegliere "Reddito" come tipo di transazione.',
          'Attenzione'
        );
        return;
      }
      this.loading = true;

      const expense = {
        amount: formValue.amount,
        category: formValue.category.id,
        description: formValue.description,
        date: new Date(formValue.date) as Date,
        isIncome: formValue.isIncome.value,
      };

      this.expensesService.addExpense(expense).subscribe(
        (response) => {
          this.onClose();
          this.loading = false;
          this.notificationService.successMessage(
            'Transazione aggiunta con successo',
            'Successo'
          );
          setTimeout(() => {
            window.location.reload();
          }, 1500);
        },
        (error) => {
          console.error("Errore nell'aggiungere la spesa", error);
          this.loading = false;
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

  onClose() {
    this.isOpen = false;
    setTimeout(() => {
      this.close.emit();
    }, 100);
  }
}
