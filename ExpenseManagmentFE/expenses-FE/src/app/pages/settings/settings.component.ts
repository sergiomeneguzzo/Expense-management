import { Component, EventEmitter, Output } from '@angular/core';
import { ThemeService } from '../../services/theme.service';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.scss',
})
export class SettingsComponent {
  constructor(private themeService: ThemeService) {}

  applyTheme(color: string) {
    this.themeService.applyTheme(color);
  }
}
