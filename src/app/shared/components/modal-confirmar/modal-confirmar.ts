import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface IConfirmacion {
  titulo: string;
  texto: string;
  textoAceptar?: string;
  claseBoton?: string;
}

/**
 * Modal de confirmación
 * Devuelve true si el usuario acepta.
 */
@Component({
  selector: 'app-modal-confirmar',
  imports: [MatDialogModule],
  templateUrl: './modal-confirmar.html',
  styleUrl: './modal-confirmar.scss',
})
export class ModalConfirmar {

  readonly data = inject<IConfirmacion>(MAT_DIALOG_DATA);
  private readonly _ref = inject(MatDialogRef<ModalConfirmar, boolean>);

  aceptar(): void {
    this._ref.close(true);
  }

  cancelar(): void {
    this._ref.close(false);
  }

}