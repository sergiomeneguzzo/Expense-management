import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  constructor(private themeService: ThemeService, private router: Router) {}

  applyTheme(color: string) {
    this.themeService.applyTheme(color);
  }

  toggleDarkMode() {
    // this.themeService.toggleDarkMode();
  }

  redirectToProfile() {
    this.router.navigate(['/profile']);
  }
}
