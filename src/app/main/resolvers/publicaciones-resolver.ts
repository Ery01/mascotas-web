import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PublicacionesResource } from '../api/resources/publicaciones-resource';
import { IPublicacion } from '../api/models/i-publicacion';

// Carga las publicaciones del refugio antes de mostrar la página
export const publicacionesResolver: ResolveFn<IPublicacion[]> = (route, state) => {
  return inject(PublicacionesResource).getPublicaciones();
};