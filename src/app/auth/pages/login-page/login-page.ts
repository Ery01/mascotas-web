import { Component, inject, input, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { Router } from '@angular/router';
import { form, FormField, FormRoot, maxLength, pattern, required } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { AuthResource } from '../../api/resources/auth-resource';
import { SessionService } from '../../../core/services/session-service';
import { ILoginData } from '../../api/models/i-login-data';
import { Autofocus } from '../../../shared/directives/autofocus';

/**
 * RF15 - Autenticar usuarios (perfil Refugio): CUIL + contraseña.
 * Formulario con Signal Forms, como data-form-page de la cátedra.
 */
@Component({
  selector: 'app-login-page',
  imports: [FormField, FormRoot, Autofocus],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  private _api = inject(AuthResource);
  private _session = inject(SessionService);
  private _router = inject(Router);

  // Parámetros de la URL (?expirada=true / ?sinPermiso=true) gracias a withComponentInputBinding()
  expirada = input<string>();
  sinPermiso = input<string>();

  error = signal<string | null>(null);
  mostrarClave = signal(false);

  credenciales = signal<ILoginData>({ cuil: '', clave: '' });

  loginForm = form(this.credenciales, (schemaPath) => {
    required(schemaPath.cuil, { message: 'Debe informar su CUIL.' });
    pattern(schemaPath.cuil, /^\d{2}-?\d{8}-?\d$/, { message: 'El CUIL debe tener 11 dígitos.' });
    maxLength(schemaPath.cuil, 13);

    required(schemaPath.clave, { message: 'Debe informar su contraseña.' });
    maxLength(schemaPath.clave, 64);
  }, {
    submission: {
      action: async () => {
        await this.ingresar();
      },
      onInvalid: () => {
        this.loginForm().markAsTouched();
      }
    }
  });

  private async ingresar(): Promise<void> {
    this.error.set(null);
    const datos: ILoginData = {
      cuil: this.credenciales().cuil.replace(/-/g, ''),
      clave: this.credenciales().clave
    };
    try {
      const respuesta = await firstValueFrom(this._api.login(datos));
      this._session.iniciar(respuesta.token, respuesta.usuario);
      this._router.navigate(['/publicaciones']);
    }
    catch (e) {
      // Los errores de credenciales se muestran en el formulario y no en el modal general
      const err = e as HttpErrorResponse;
      this.error.set(err.status === 0
        ? 'No fue posible conectarse con el servicio.'
        : err.error?.message ?? 'No fue posible iniciar sesión.');
    }
  }

}