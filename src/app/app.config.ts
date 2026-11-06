import { ApplicationConfig, ErrorHandler, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { appHttpInterceptor } from './core/interceptors/app-http-interceptor';
import { authInterceptor } from './core/interceptors/auth-interceptor';
import { AppErrorHandler } from './core/handlers/app-error-handler';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(routes,
      withComponentInputBinding()
    ),
    provideHttpClient(
      withInterceptors([appHttpInterceptor, authInterceptor])
    ),
    { provide: ErrorHandler, useClass: AppErrorHandler }
  ]
};