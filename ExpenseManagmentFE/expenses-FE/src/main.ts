import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

platformBrowserDynamic()
  .bootstrapModule(AppModule, {
    ngZoneEventCoalescing: true,
  })
  .catch((err) => console.error(err));

const observer = new MutationObserver(() => {
  if (document.body.classList.contains('p-overflow-hidden')) {
    document.body.classList.remove('p-overflow-hidden');
  }
});

observer.observe(document.body, {
  attributes: true,
  attributeFilter: ['class'],
});
