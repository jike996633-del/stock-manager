/**
 * Bootstrap for the Stock Manager app.
 * Sets up routing, HttpClient and Ionic (Material mode).
 * Author: Ke Ji
 */
import { bootstrapApplication } from '@angular/platform-browser';
import { RouteReuseStrategy, provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { IonicRouteStrategy, provideIonicAngular } from '@ionic/angular/standalone';

import { RootComponent } from './app/app.component';
import { APP_ROUTES } from './app/app.routes';

bootstrapApplication(RootComponent, {
  providers: [
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    provideIonicAngular({ mode: 'md', animated: true }),
    provideRouter(APP_ROUTES, withComponentInputBinding()),
    provideHttpClient(withInterceptorsFromDi())
  ]
}).catch((err: unknown) => {
  // Surface bootstrap-time errors in dev.
  // eslint-disable-next-line no-console
  console.error('[bootstrap]', err);
});
