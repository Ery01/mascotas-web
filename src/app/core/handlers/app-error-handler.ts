import { ErrorHandler, inject, Injectable, isDevMode, NgZone } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { AppMessageService, IMessage } from '../services/app-message-service';

/**
 * Captura los errores no manejados y los
 * muestra en un modal. Mensaje desde el backend.
 */
@Injectable()
export class AppErrorHandler implements ErrorHandler {

  private readonly _service = inject(AppMessageService);
  private readonly _zone = inject(NgZone);

  handleError(error: unknown): void {
    error = this.unwrapError(error);
    if (isDevMode()) {
      console.error('[ErrorHandler]', error);
    }

    if (error instanceof HttpErrorResponse && error.status === 401) {
      return;
    }

    const message = this.getMessage(error);
    this._zone.run(() => this._service.showMessage(message));
  }

  private unwrapError(error: unknown): unknown {
    if (typeof error === 'object' && error !== null && 'rejection' in error) {
      return (error as { rejection: unknown }).rejection;
    }
    return error;
  }

  private getMessage(error: unknown): IMessage {
    if (error instanceof HttpErrorResponse) {
      if (error.status === 0) {
        return { text: 'Error al conectarse al servicio', num: error.status };
      }
      return { text: this.getHttpErrorMessage(error), num: error.status };
    }
    if (error instanceof Error) {
      return { text: error.message };
    }
    return { text: String(error) };
  }

  private getHttpErrorMessage(error: HttpErrorResponse): string {
    if (typeof error.error === 'string') {
      return error.error;
    }
    if (error.error?.message) {
      return error.error.message;
    }
    if (error.error?.error) {
      return error.error.error;
    }
    return error.message;
  }

}