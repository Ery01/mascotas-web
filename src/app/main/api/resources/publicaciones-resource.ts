import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { IEspecie } from '../models/i-especie';
import { EstadoPublicacion, IPublicacion } from '../models/i-publicacion';
import { IPublicacionData } from '../models/i-publicacion-data';
import { IPublicacionCreada } from '../models/i-publicacion-creada';

// RF13 - Recursos REST /publicaciones y /especies del backend
@Service()
export class PublicacionesResource {

  private readonly _baseUrl = environment.apiUrl;
  private _http = inject(HttpClient);

  getPublicaciones(): Observable<IPublicacion[]> {
    return this._http.get<IPublicacion[]>(`${this._baseUrl}/publicaciones`);
  }

  getEspecies(): Observable<IEspecie[]> {
    return this._http.get<IEspecie[]>(`${this._baseUrl}/especies`);
  }

  insPublicacion(data: IPublicacionData): Observable<IPublicacionCreada> {
    return this._http.post<IPublicacionCreada>(`${this._baseUrl}/publicaciones`, data);
  }

  updEstado(nroPublicacion: number, estadoPublicacion: EstadoPublicacion): Observable<void> {
    return this._http.patch<void>(`${this._baseUrl}/publicaciones/${nroPublicacion}/estado`, { estadoPublicacion });
  }

}