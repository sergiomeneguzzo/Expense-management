import { Component } from '@angular/core';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {
  isClosed: boolean = true;

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }
}
