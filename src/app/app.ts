import { Component, computed, inject } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { toSignal } from '@angular/core/rxjs-interop';
import { filter, map } from 'rxjs';
import { Loader } from './core/layouts/loader/loader';
import { Navbar } from './core/layouts/navbar/navbar';
import { SessionService } from './core/services/session-service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Loader, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {

  private _session = inject(SessionService);
  private _router = inject(Router);

  private _url = toSignal(
    this._router.events.pipe(
      filter(e => e instanceof NavigationEnd),
      map(e => (e as NavigationEnd).urlAfterRedirects)
    ),
    { initialValue: '' }
  );

  // La barra superior se muestra solo con sesión iniciada y fuera del login
  readonly mostrarNavbar = computed(() => this._session.autenticado() && !this._url().startsWith('/login'));

}