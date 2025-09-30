import {
  ApplicationConfig,
  importProvidersFrom,
  provideZoneChangeDetection,
} from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideStoreDevtools } from '@ngrx/store-devtools';

import { routes } from './app.routes';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { provideAnimations } from '@angular/platform-browser/animations';
import { en_US, provideNzI18n } from 'ng-zorro-antd/i18n';
import { FormsModule } from '@angular/forms';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideStore } from '@ngrx/store';
import { reducers } from './store';
import { notificationInterceptor } from './core/interceptors/notification.interceptor';
import { UserEffects } from './store/user/user.effects';
import { provideEffects } from '@ngrx/effects';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptors([notificationInterceptor])),
    provideNzI18n(en_US),
    importProvidersFrom(FormsModule),
    provideAnimationsAsync(),
    provideHttpClient(),
    provideStore(reducers),
    provideEffects(),
    provideEffects(UserEffects),
    provideStoreDevtools({
      maxAge: 25, // Retains last 25 states
      logOnly: true, // Set to true for production
    }),
    importProvidersFrom(NzNotificationModule),
  ],
};
