import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  constructor(private messageService: MessageService) {}

  successMessage(message: string, summary: string = 'Successo'): void {
    this.messageService.add({
      severity: 'success',
      summary: summary,
      detail: message,
    });
  }

  errorMessage(message: string, summary: string = 'Errore'): void {
    this.messageService.add({
      severity: 'error',
      summary: summary,
      detail: message,
    });
  }

  warningMessage(message: string, summary: string = 'Attenzione'): void {
    this.messageService.add({
      severity: 'warn',
      summary: summary,
      detail: message,
    });
  }

  infoMessage(message: string, summary: string = 'Informazione'): void {
    this.messageService.add({
      severity: 'info',
      summary: summary,
      detail: message,
    });
  }

  clearMessages(): void {
    this.messageService.clear();
  }
}
