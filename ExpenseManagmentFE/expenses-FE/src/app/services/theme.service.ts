import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  constructor() {
    this.loadTheme();
  }
  applyTheme(theme: string) {
    document.documentElement.style.setProperty('--primary-color', theme);
    localStorage.setItem('theme', theme);
  }

  toggleMode() {
    const currentMode = localStorage.getItem('mode');
    if (currentMode === 'dark') {
      this.setLightMode();
    } else {
      this.setDarkMode();
    }
  }

  setDarkMode() {
    document.documentElement.classList.add('dark-mode');
    localStorage.setItem('mode', 'dark');
  }

  setLightMode() {
    document.documentElement.classList.remove('dark-mode');
    localStorage.setItem('mode', 'light');
  }

  loadTheme() {
    const themeColor = localStorage.getItem('theme') || '#0ddc86';
    document.documentElement.style.setProperty('--primary-color', themeColor);

    const mode = localStorage.getItem('mode') || 'light';
    if (mode === 'dark') {
      this.setDarkMode();
    } else {
      this.setLightMode();
    }
  }
}
