import { inject, Service } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../../environments/environment';
import { ILoginData } from '../models/i-login-data';
import { ILoginResponse } from '../models/i-login-response';

// RF15
@Service()
export class AuthResource {

  private readonly _baseUrl = `${environment.apiUrl}/auth`;
  private _http = inject(HttpClient);

  login(data: ILoginData): Observable<ILoginResponse> {
    return this._http.post<ILoginResponse>(`${this._baseUrl}/login`, data);
  }

}