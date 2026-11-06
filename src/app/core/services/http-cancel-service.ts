import { inject, Service } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';
import { filter, Subject } from 'rxjs';

// Esto sirve para cancelar las solicitudes pendientes al navegar
@Service()
export class HttpCancelService {

  private _router = inject(Router);
  private _subject = new Subject<void>();

  constructor() {
    this._router.events
      .pipe(filter(event => event instanceof NavigationStart))
      .subscribe(() => this.cancelPendingRequests());
  }

  get pendingHTTPRequests$() {
    return this._subject.asObservable();
  }

  cancelPendingRequests(): void {
    this._subject.next();
  }

}
