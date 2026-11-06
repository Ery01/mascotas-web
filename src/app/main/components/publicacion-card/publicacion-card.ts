import { Component, computed, input, output } from '@angular/core';
import { DatePipe } from '@angular/common';
import { EstadoPublicacion, IPublicacion } from '../../api/models/i-publicacion';
import { EdadPipe } from '../../../shared/pipes/edad-pipe';
import { EspecieSexoPipe } from '../../../shared/pipes/especie-sexo-pipe';
import { FotoUrlPipe } from '../../../shared/pipes/foto-url-pipe';

export interface ICambioEstado {
  publicacion: IPublicacion;
  estado: EstadoPublicacion;
}

/**
 * Tarjeta de una publicación (comunicación padre-hijo):
 *  - input:  la publicación a mostrar
 *  - output: la acción elegida (activar, pausar o finalizar)
 * Solo muestra las acciones válidas para el estado actual (RF13).
 */
@Component({
  selector: 'app-publicacion-card',
  imports: [DatePipe, EdadPipe, EspecieSexoPipe, FotoUrlPipe],
  templateUrl: './publicacion-card.html',
  styleUrl: './publicacion-card.scss',
})
export class PublicacionCard {

  publicacion = input.required<IPublicacion>();
  cambiarEstado = output<ICambioEstado>();

  readonly puedeActivar = computed(() => this.publicacion().estadoPublicacion === 'Pausada');
  readonly puedePausar = computed(() => this.publicacion().estadoPublicacion === 'Activa');
  readonly puedeFinalizar = computed(() => this.publicacion().estadoPublicacion !== 'Finalizada');

  readonly claseEstado = computed(() => {
    switch (this.publicacion().estadoPublicacion) {
      case 'Activa': return 'text-bg-success';
      case 'Pausada': return 'text-bg-warning';
      default: return 'text-bg-secondary';
    }
  });

  readonly iconoEstado = computed(() => {
    switch (this.publicacion().estadoPublicacion) {
      case 'Activa': return 'check_circle';
      case 'Pausada': return 'pause_circle';
      default: return 'cancel';
    }
  });

  accion(estado: EstadoPublicacion): void {
    this.cambiarEstado.emit({ publicacion: this.publicacion(), estado });
  }

}