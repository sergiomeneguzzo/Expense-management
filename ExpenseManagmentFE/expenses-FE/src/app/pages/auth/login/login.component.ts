import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { catchError } from 'rxjs/internal/operators/catchError';
import { throwError } from 'rxjs/internal/observable/throwError';
import { Router } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';
import { NotificationService } from '../../../services/notification.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss',
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  isLoading = false;
  loginError = '';

  private destroyed$ = new Subject<void>();

  constructor(
    private fb: FormBuilder,
    private authSrv: AuthService,
    private notify: NotificationService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username: [''],
      password: [''],
    });
  }

  ngOnInit(): void {
    this.loginForm.valueChanges
      .pipe(takeUntil(this.destroyed$))
      .subscribe(() => {
        this.loginError = '';
      });
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }

  login() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      const { username, password } = this.loginForm.value;
      this.authSrv
        .login(username!, password!)
        .pipe(
          catchError((err) => {
            this.isLoading = false;
            if (err.error?.message === 'email not confirmed') {
              this.isLoading = false;
              this.notify.errorMessage('La tua email non è stata confermata!');
            } else {
              this.isLoading = false;
              this.notify.errorMessage('Credenziali errate o invalide');
            }
            return throwError(() => err);
          })
        )
        .subscribe({
          next: (user) => {
            this.isLoading = false;
            this.router.navigate(['/dashboard']);
          },
          error: () => {},
        });
    }
  }
}
