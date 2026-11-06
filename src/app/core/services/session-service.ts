import { computed, Service, signal } from '@angular/core';
import { IUsuarioSesion } from '../models/i-usuario-sesion';

const CLAVE_TOKEN = 'mc_token';
const CLAVE_USUARIO = 'mc_usuario';

/**
 * Mantiene el contexto de la sesión (RF15): token JWT y usuario autenticado.
 * Se guarda en sessionStorage: sobrevive a un F5 pero se borra al cerrar la pestaña.
 */
@Service()
export class SessionService {

  private _token = signal<string | null>(this.leer(CLAVE_TOKEN));
  private _usuario = signal<IUsuarioSesion | null>(this.leerUsuario());

  readonly token = this._token.asReadonly();
  readonly usuario = this._usuario.asReadonly();
  readonly autenticado = computed(() => this._token() !== null && !this.vencido());

  iniciar(token: string, usuario: IUsuarioSesion): void {
    sessionStorage.setItem(CLAVE_TOKEN, token);
    sessionStorage.setItem(CLAVE_USUARIO, JSON.stringify(usuario));
    this._token.set(token);
    this._usuario.set(usuario);
  }

  cerrar(): void {
    sessionStorage.removeItem(CLAVE_TOKEN);
    sessionStorage.removeItem(CLAVE_USUARIO);
    this._token.set(null);
    this._usuario.set(null);
  }

  tieneRol(roles: string[]): boolean {
    const rol = this._usuario()?.rol;
    return !!rol && roles.includes(rol);
  }

  /**
   * Lee la fecha de vencimiento (exp) del JWT. Solo sirve para la interfaz:
   * la validación real del token la hace siempre el backend.
   */
  private vencido(): boolean {
    const token = this._token();
    if (!token) return true;
    try {
      const payload = JSON.parse(atob(token.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
      return typeof payload.exp === 'number' && payload.exp * 1000 < Date.now();
    }
    catch {
      return true;
    }
  }

  private leer(clave: string): string | null {
    return sessionStorage.getItem(clave);
  }

  private leerUsuario(): IUsuarioSesion | null {
    const json = sessionStorage.getItem(CLAVE_USUARIO);
    return json ? JSON.parse(json) as IUsuarioSesion : null;
  }

}