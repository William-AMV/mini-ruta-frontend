import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import {provideAnimations} from '@angular/platform-browser/animations';
import {provideHttpClient, withInterceptors} from '@angular/common/http';
import {apiPrefixInterceptor} from './core/interceptors/api-prefix.interceptor';
import {errorHandlerInterceptor} from './core/interceptors/error-handler.interceptor';
import {ConfirmationService, MessageService} from 'primeng/api';
import { DialogService } from 'primeng/dynamicdialog';
import {apiInterceptor} from './core/interceptors/api.inteceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideAnimations(),
    provideHttpClient(withInterceptors([
      apiInterceptor,
      apiPrefixInterceptor,
      errorHandlerInterceptor,
    ])),
    ConfirmationService,
    DialogService,
    MessageService
  ]
};