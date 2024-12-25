import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {}

  applyTheme(theme: string) {
    document.documentElement.style.setProperty('--primary-color', theme);
    localStorage.setItem('theme', theme);
  }
}
