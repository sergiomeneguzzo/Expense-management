import { Component } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { NotificationService } from '../../../services/notification.service';
import { customEmailValidator } from '../../../validators/email-validator';
import { strongPasswordValidator } from '../../../validators/strongpassword-validator';
import { urlValidator } from '../../../validators/url-validator';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss',
})
export class RegisterComponent {
  registerForm: FormGroup;
  hide = true;
  isLoading = false;

  private destroyed$ = new Subject<void>();

  constructor(
    protected fb: FormBuilder,
    private authSrv: AuthService,
    private router: Router,
    private notification: NotificationService
  ) {
    this.registerForm = this.fb.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      picture: ['', [urlValidator()]],
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

  register() {
    if (this.registerForm.valid) {
      this.isLoading = true;
      let {
        firstName,
        lastName,
        username,
        picture,
        password,
        confirmPassword,
      } = this.registerForm.value;

      if (!picture) {
        picture =
          'https://static.vecteezy.com/ti/vettori-gratis/p1/2318271-icona-profilo-utente-vettoriale.jpg';
      }

      console.log('Credenziali', this.registerForm.value);
      this.authSrv
        .register(
          firstName!,
          lastName!,
          username!,
          picture!,
          password!,
          confirmPassword!
        )
        .subscribe({
          next: (res) => {
            this.isLoading = false;
            this.notification.successMessage(
              'Registrazione avvenuta con successo'
            );
            this.router.navigate([`/check-email`]);
          },
          error: (err) => {
            this.isLoading = false;
            if (err.error && err.error.message) {
              if (err.error.error === 'UserExistsError') {
                this.notification.errorMessage(
                  "Email gia in uso. Prova con un'altra email"
                );
              } else if (err.error.error === 'PasswordMismatch') {
                this.notification.errorMessage(
                  'Password e conferma password non corrispondono'
                );
              } else {
                this.notification.errorMessage(
                  'Registrazione fallita. Riprova più tardi'
                );
              }
            } else {
              this.notification.errorMessage(
                'Registrazione fallita. Riprova più tardi'
              );
            }
          },
        });
    } else {
      this.isLoading = false;
      this.notification.errorMessage('Compila tutti i campi correttamente');
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
