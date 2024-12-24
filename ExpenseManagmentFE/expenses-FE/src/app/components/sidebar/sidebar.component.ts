import { Component, EventEmitter, Input, Output } from '@angular/core';
import { User } from '../../entities/user';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isClosed: boolean = true;

  @Output() logout = new EventEmitter<void>();
  @Input() user: User | null = null;

  constructor(private authSrv: AuthService) {}

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }
}
