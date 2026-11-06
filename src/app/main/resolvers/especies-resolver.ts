import { inject } from '@angular/core';
import { ResolveFn } from '@angular/router';
import { PublicacionesResource } from '../api/resources/publicaciones-resource';
import { IEspecie } from '../api/models/i-especie';

// Carga las especies para el formulario de alta
export const especiesResolver: ResolveFn<IEspecie[]> = (route, state) => {
  return inject(PublicacionesResource).getEspecies();
};