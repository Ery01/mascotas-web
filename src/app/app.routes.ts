import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';
import { invitadoGuard } from './core/guards/invitado-guard';

export const routes: Routes = [
  {
    path: 'login',
    canActivate: [invitadoGuard],
    loadChildren: () => import('./auth/auth.routes').then(m => m.routes)
  },
  {
    path: 'publicaciones',
    canActivate: [authGuard],
    data: { roles: ['REFUGIO'] },
    loadChildren: () => import('./main/main.routes').then(m => m.routes)
  },
  { path: '', pathMatch: 'full', redirectTo: 'publicaciones' },
  { path: '**', redirectTo: 'publicaciones' }
];