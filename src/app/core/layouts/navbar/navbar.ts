import { Component, computed, inject } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { SessionService } from '../../services/session-service';

@Component({
  selector: 'app-navbar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar {

  private _session = inject(SessionService);
  private _router = inject(Router);

  readonly usuario = this._session.usuario;

  // Format del cuil 27123456789 -> 27-12345678-9
  readonly cuil = computed(() => {
    const c = this.usuario()?.cuil ?? '';
    return c.length === 11 ? `${c.slice(0, 2)}-${c.slice(2, 10)}-${c.slice(10)}` : c;
  });

  cerrarSesion(): void {
    this._session.cerrar();
    this._router.navigate(['/login']);
  }

}