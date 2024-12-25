import { Component } from '@angular/core';
import { User } from '../../entities/user';
import { AuthService } from '../../services/auth.service';
import { NotificationService } from '../../services/notification.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss',
})
export class ProfileComponent {
  user: User | null = null;
  isLoading = false;

  constructor(
    private authService: AuthService,
    private notify: NotificationService
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.authService.currentUser$.subscribe((user) => {
      this.user = user;
      this.isLoading = false;
    });
  }
}
