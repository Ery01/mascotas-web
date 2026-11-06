import { inject, Service } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalMessage } from '../layouts/modal-message/modal-message';

export interface IMessage {
  text: string;
  num?: number;
  title?: string;
}

// Mostrar mensajes en un modal
@Service()
export class AppMessageService {

  private _dialog = inject(MatDialog);

  showMessage(message: IMessage): void {
    this._dialog.open(ModalMessage, {
      data: message,
      width: '380px',
      maxWidth: '95vw',
      disableClose: true,
      autoFocus: false,
      panelClass: 'dialog-mc'
    });
  }

}
