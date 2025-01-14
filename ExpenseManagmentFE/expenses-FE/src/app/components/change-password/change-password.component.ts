import { Component, EventEmitter, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  displayModal: boolean = false;
  passwordForm: FormGroup;

  @Output() passwordUpdated = new EventEmitter<void>();

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private notify: NotificationService
  ) {
    this.passwordForm = this.fb.group(
      {
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordsMatch }
    );
  }

  openDialog(): void {
    this.displayModal = true;
  }

  onSubmit(): void {
    if (this.passwordForm.valid) {
      const { newPassword, confirmPassword } = this.passwordForm.value;
      this.authService.updatePassword(newPassword, confirmPassword).subscribe({
        next: () => {
          this.passwordUpdated.emit();
          this.displayModal = false;
          this.passwordForm.reset();
          this.notify.successMessage('Password aggiornata con successo');
        },
        error: (err: any) =>
          this.notify.errorMessage(
            'Impossibile aggiornare la password, riprova più tardi'
          ),
      });
    }
  }

  private passwordsMatch(group: FormGroup): { [key: string]: boolean } | null {
    const newPassword = group.get('newPassword')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }
}
