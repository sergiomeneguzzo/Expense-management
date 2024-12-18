import { Component } from '@angular/core';
import { NotificationService } from './services/notification.service';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isClosed = false;
  isLoading = false;
  currentUser$;

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }

  constructor(
    public authSrv: AuthService,
    private notificationService: NotificationService
  ) {
    this.currentUser$ = this.authSrv.currentUser$;

    this.authSrv.loading$.subscribe((loading) => {
      this.isLoading = loading;
    });
  }

  logout(): void {
    this.authSrv.logout();
  }

  showSuccess(): void {
    this.notificationService.successMessage(
      'Operazione completata con successo!'
    );
  }

  showError(): void {
    this.notificationService.errorMessage('Si è verificato un errore!');
  }

  showWarning(): void {
    this.notificationService.warningMessage(
      'Attenzione! Controlla i dettagli.'
    );
  }

  showInfo(): void {
    this.notificationService.infoMessage("Questa è un'informazione.");
  }
}
