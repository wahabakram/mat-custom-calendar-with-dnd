import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadChildren: async () => (await import('@components/calendar/index.routes')).routes,
  },
];
