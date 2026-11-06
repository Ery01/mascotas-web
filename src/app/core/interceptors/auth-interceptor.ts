import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SessionService } from '../services/session-service';

/**
 * Agrega a TODAS las solicitudes al backend:
 *   X-API-Key: identifica a la aplicación
 *   Authorization: Bearer <token>  (si hay sesión)
 * Si el backend responde 401 (token vencido o inválido) cierra la sesión y vuelve al login.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  const session = inject(SessionService);
  const router = inject(Router);

  const headers: Record<string, string> = { 'X-API-Key': environment.apiKey };
  const token = session.token();
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return next(req.clone({ setHeaders: headers })).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && token) {
        session.cerrar();
        router.navigate(['/login'], { queryParams: { expirada: true } });
      }
      return throwError(() => error);
    })
  );
};
