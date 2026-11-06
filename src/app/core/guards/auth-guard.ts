import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { SessionService } from '../services/session-service';

/**
 * Protege las rutas privadas:
 *  - sin sesión          -> al login
 *  - rol no autorizado   -> al login (los roles se indican en data: { roles: [...] })
 * Es solo para la interfaz: el backend vuelve a validar token y rol en cada solicitud.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const session = inject(SessionService);
  const router = inject(Router);

  if (!session.autenticado()) {
    session.cerrar();
    return router.createUrlTree(['/login']);
  }

  const roles = route.data['roles'] as string[] | undefined;
  if (roles && !session.tieneRol(roles)) {
    session.cerrar();
    return router.createUrlTree(['/login'], { queryParams: { sinPermiso: true } });
  }

  return true;
};
