/**
 * Shell (Tabs) routes - each tab is a lazily-loaded standalone page.
 * Author: Tianjie Zhou
 */
import { Routes } from '@angular/router';
import { ShellPage } from './shell.page';

export const SHELL_ROUTES: Routes = [
  {
    path: '',
    component: ShellPage,
    children: [
      {
        path: 'list',
        loadComponent: () =>
          import('../list/list.page').then((m) => m.ListPage)
      },
      {
        path: 'new',
        loadComponent: () =>
          import('../new/new.page').then((m) => m.NewPage)
      },
      {
        path: 'manage',
        loadComponent: () =>
          import('../manage/manage.page').then((m) => m.ManagePage)
      },
      {
        path: 'about',
        loadComponent: () =>
          import('../about/about.page').then((m) => m.AboutPage)
      },
      { path: '', redirectTo: 'list', pathMatch: 'full' }
    ]
  },
  { path: '**', redirectTo: 'list' }
];
