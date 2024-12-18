import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  isClosed = false;

  toggleSidebar() {
    this.isClosed = !this.isClosed;
  }
}
