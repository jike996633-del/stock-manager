/**
 * Root routes - delegates everything to the Tabs shell.
 * Author: Jiutai Yu
 */
import { Routes } from '@angular/router';

export const APP_ROUTES: Routes = [
  {
    path: '',
    loadChildren: () =>
      import('./pages/shell/shell.routes').then((m) => m.SHELL_ROUTES)
  }
];
