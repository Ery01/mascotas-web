import { Component, computed, inject, input, model, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { form, FormField } from '@angular/forms/signals';
import { PublicacionesResource } from '../../api/resources/publicaciones-resource';
import { IPublicacion } from '../../api/models/i-publicacion';
import { IEspecie } from '../../api/models/i-especie';
import { IPublicacionCreada } from '../../api/models/i-publicacion-creada';
import { ICambioEstado, PublicacionCard } from '../../components/publicacion-card/publicacion-card';
import { ModalNuevaPublicacion } from '../../components/modal-nueva-publicacion/modal-nueva-publicacion';
import { ModalConfirmar } from '../../../shared/components/modal-confirmar/modal-confirmar';
import { FiltrarPorPipe } from '../../../shared/pipes/filtrar-por-pipe';
import { SessionService } from '../../../core/services/session-service';

/**
 * RF13 - Pantalla principal "Mis publicaciones de adopción".
 * Las publicaciones y las especies llegan por los resolvers
 */
@Component({
  selector: 'app-publicaciones-page',
  imports: [FormField, FiltrarPorPipe, PublicacionCard],
  templateUrl: './publicaciones-page.html',
  styleUrl: './publicaciones-page.scss',
})
export class PublicacionesPage {

  private _api = inject(PublicacionesResource);
  private _dialog = inject(MatDialog);
  private _snackBar = inject(MatSnackBar);
  private _session = inject(SessionService);

  publicaciones = model<IPublicacion[]>([]);
  especies = input<IEspecie[]>([]);

  readonly refugio = computed(() => this._session.usuario()?.razonSocial ?? '');

  filtroModel = model<string>('');
  filtroForm = form(this.filtroModel);
  estadoFiltro = signal<string>('');

  readonly porEstado = computed(() => {
    const estado = this.estadoFiltro();
    return estado ? this.publicaciones().filter(p => p.estadoPublicacion === estado) : this.publicaciones();
  });

  nuevaPublicacion(): void {
    this._dialog.open<ModalNuevaPublicacion, IEspecie[], IPublicacionCreada>(ModalNuevaPublicacion, {
      data: this.especies(),
      width: '720px',
      maxWidth: '95vw',
      maxHeight: '95vh',
      autoFocus: false,
      panelClass: 'dialog-mc'
    }).afterClosed().subscribe(creada => {
      if (creada) {
        this.recargar();
        this.avisar(`Publicación registrada. NRM asignado: ${creada.nroRegMunicipal}`);
      }
    });
  }

  cambiarEstado(cambio: ICambioEstado): void {
    if (cambio.estado === 'Finalizada') {
      this._dialog.open(ModalConfirmar, {
        data: {
          titulo: 'Finalizar publicación',
          texto: `"${cambio.publicacion.nombre}" dejará de estar disponible para adopción. Una publicación finalizada no puede reactivarse. ¿Desea continuar?`,
          textoAceptar: 'Finalizar',
          claseBoton: 'btn-danger'
        },
        width: '420px',
        maxWidth: '95vw',
        panelClass: 'dialog-mc'
      }).afterClosed().subscribe(ok => {
        if (ok) this.enviarCambio(cambio);
      });
      return;
    }
    this.enviarCambio(cambio);
  }

  private enviarCambio(cambio: ICambioEstado): void {
    this._api.updEstado(cambio.publicacion.nroPublicacion, cambio.estado).subscribe(() => {
      this.publicaciones.update(lista => lista.map(p =>
        p.nroPublicacion === cambio.publicacion.nroPublicacion ? { ...p, estadoPublicacion: cambio.estado } : p
      ));
      this.avisar(`La publicación de ${cambio.publicacion.nombre} quedó ${cambio.estado.toLowerCase()}.`);
    });
  }

  private recargar(): void {
    this._api.getPublicaciones().subscribe(lista => this.publicaciones.set(lista));
  }

  private avisar(mensaje: string): void {
    this._snackBar.open(mensaje, 'Cerrar', { duration: 4000 });
  }

}