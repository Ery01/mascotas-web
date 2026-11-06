import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session-service';

// Si el usuario ya inició sesión, no tiene sentido mostrarle el login
export const invitadoGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  return session.autenticado() ? inject(Router).createUrlTree(['/publicaciones']) : true;
};