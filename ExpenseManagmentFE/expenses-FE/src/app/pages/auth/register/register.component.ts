import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { customEmailValidator } from '../../../validators/email-validator';
import { strongPasswordValidator } from '../../../validators/strongpassword-validator';
import { urlValidator } from '../../../validators/url-validator';
import { Router } from '@angular/router';
import { ExpensesService } from '../../../services/expenses.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  selectedFile: File | null = null;
  hide = true;
  isLoading = false;

  private destroyed$ = new Subject<void>();

  constructor(
    protected fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private notification: NotificationService,
    private expenseSrv: ExpensesService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      // picture: ['', [urlValidator()]],
      username: [
        '',
        [Validators.required, Validators.email, customEmailValidator()],
      ],
      password: ['', [Validators.required, strongPasswordValidator()]],
      confirmPassword: [
        '',
        [Validators.required, this.matchPasswordValidator('password')],
      ],
    });
  }

  ngOnInit(): void {
    this.registerForm.valueChanges.pipe(takeUntil(this.destroyed$));
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  clearFile(event: Event) {
    event.preventDefault();
    event.stopPropagation();
    this.selectedFile = null;
    this.registerForm.get('picture')?.reset();
  }

  async register(): Promise<void> {
    if (this.registerForm.valid) {
      this.isLoading = true;
      const { firstName, lastName, username, password, confirmPassword } =
        this.registerForm.value;

      try {
        let picture =
          'https://static.vecteezy.com/ti/vettori-gratis/p1/2318271-icona-profilo-utente-vettoriale.jpg';

        if (this.selectedFile) {
          const response = await this.expenseSrv
            .uploadFile(this.selectedFile)
            .toPromise();
          picture = response.secure_url;
        }

        await this.authSrv
          .register(
            firstName,
            lastName,
            username,
            picture,
            password,
            confirmPassword
          )
          .toPromise();

        this.notification.successMessage(
          'Registrazione avvenuta con successo!'
        );
        this.router.navigate(['/check-email']);
      } catch (err: any) {
        this.isLoading = false;
        this.handleRegistrationError(err);
      }
    } else {
      this.notification.errorMessage('Compila tutti i campi correttamente');
    }
  }

  private handleRegistrationError(err: any): void {
    if (err.error && err.error.message) {
      switch (err.error.error) {
        case 'UserExistsError':
          this.notification.errorMessage(
            "L'email è già in uso. Prova con un'altra."
          );
          break;
        case 'PasswordMismatch':
          this.notification.errorMessage(
            'Le password non coincidono. Riprova.'
          );
          break;
        default:
          this.notification.errorMessage(
            'Registrazione fallita. Riprova più tardi.'
          );
          break;
      }
    } else {
      this.notification.errorMessage(
        'Si è verificato un errore imprevisto. Contatta il supporto.'
      );
    }
  }

  matchPasswordValidator(passwordField: string) {
    return (control: any) => {
      const form = control.parent;
      if (form) {
        const password = form.get(passwordField)?.value;
        return password === control.value ? null : { passwordMismatch: true };
      }
      return null;
    };
  }
}
