import { Component } from '@angular/core';
import { User } from '../../entities/user';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';
import { HttpClient } from '@angular/common/http';
import { ExpensesService } from '../../services/expenses.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User | null = null;
  selectedFile: File | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notificationService: NotificationService,
    private expenseSrv: ExpensesService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
    }
  }

  onUpload(): void {
    if (this.selectedFile) {
      this.isLoading = true;
      this.expenseSrv.uploadFile(this.selectedFile).subscribe({
        next: (response) => {
          const imageUrl = response.secure_url;
          this.authService.updateProfilePicture(imageUrl).subscribe({
            next: (updatedUser) => {
              this.user = updatedUser;
              this.isLoading = false;
              this.notificationService.successMessage(
                'Foto aggiornata con successo!'
              );
              setTimeout(() => {
                window.location.reload();
              }, 1000);
            },
            error: () => {
              this.isLoading = false;
              this.notificationService.errorMessage(
                'Errore durante il salvataggio!'
              );
            },
          });
        },
        error: () => {
          this.isLoading = false;
          this.notificationService.errorMessage(
            'Errore durante il caricamento!'
          );
        },
      });
    }
  }
}
