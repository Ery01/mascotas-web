import { Routes } from '@angular/router';
import { publicacionesResolver } from './resolvers/publicaciones-resolver';
import { especiesResolver } from './resolvers/especies-resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/publicaciones-page/publicaciones-page').then(m => m.PublicacionesPage),
    resolve: {
      publicaciones: publicacionesResolver,
      especies: especiesResolver
    }
  }
];