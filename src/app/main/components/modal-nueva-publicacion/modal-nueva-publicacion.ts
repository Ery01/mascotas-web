import { Component, computed, inject, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { form, FormField, FormRoot, maxLength, pattern, required, validate } from '@angular/forms/signals';
import { firstValueFrom } from 'rxjs';
import { PublicacionesResource } from '../../api/resources/publicaciones-resource';
import { IEspecie } from '../../api/models/i-especie';
import { IPublicacionData } from '../../api/models/i-publicacion-data';
import { IPublicacionCreada } from '../../api/models/i-publicacion-creada';
import { Autofocus } from '../../../shared/directives/autofocus';
import { ModalConfirmar } from '../../../shared/components/modal-confirmar/modal-confirmar';

interface IPublicacionForm {
  nombre: string;
  especie: string;
  sexo: string;
  edad: string;
  raza: string;
  caracteristicas: string;
  condicion: string;
  foto: string;
  tipoFoto: string;
}

const LADO_MAXIMO_FOTO = 1280;
const TAMANIO_MAXIMO_ARCHIVO = 10 * 1024 * 1024;
const TIPOS_PERMITIDOS = ['image/jpeg', 'image/png', 'image/webp'];

/**
 * RF13 - Alta de publicación (formulario de la maqueta "Nueva publicación de adopción").
 * Devuelve la publicación creada al cerrar, o undefined si se canceló.
 */
@Component({
  selector: 'app-modal-nueva-publicacion',
  imports: [MatDialogModule, FormField, FormRoot, Autofocus],
  templateUrl: './modal-nueva-publicacion.html',
  styleUrl: './modal-nueva-publicacion.scss',
})
export class ModalNuevaPublicacion {

  private _api = inject(PublicacionesResource);
  private _dialog = inject(MatDialog);
  private _ref = inject(MatDialogRef<ModalNuevaPublicacion, IPublicacionCreada>);

  readonly especies = inject<IEspecie[]>(MAT_DIALOG_DATA);

  error = signal<string | null>(null);
  errorFoto = signal<string | null>(null);
  procesandoFoto = signal(false);

  datos = signal<IPublicacionForm>(this.nuevaPublicacion());

  readonly vistaPrevia = computed(() =>
    this.datos().foto ? `data:${this.datos().tipoFoto};base64,${this.datos().foto}` : null
  );

  pubForm = form(this.datos, (schemaPath) => {
    required(schemaPath.nombre, { message: 'Debe informar el nombre.' });
    maxLength(schemaPath.nombre, 100, { message: 'Máximo 100 caracteres.' });

    required(schemaPath.especie, { message: 'Debe seleccionar la especie.' });
    required(schemaPath.sexo, { message: 'Debe seleccionar el sexo.' });

    pattern(schemaPath.edad, /^\d{0,2}$/, { message: 'Ingrese la edad en años (0 a 40).' });
    maxLength(schemaPath.edad, 2);
    validate(schemaPath.edad, ({ value }) =>
      value() !== '' && Number(value()) > 40
        ? { kind: 'edadMaxima', message: 'La edad no puede superar los 40 años.' }
        : null
    );

    maxLength(schemaPath.raza, 100, { message: 'Máximo 100 caracteres.' });

    required(schemaPath.caracteristicas, { message: 'Debe describir a la mascota.' });
    maxLength(schemaPath.caracteristicas, 2000, { message: 'Máximo 2000 caracteres.' });

    required(schemaPath.condicion, { message: 'Debe informar las condiciones de adopción.' });
    maxLength(schemaPath.condicion, 1000, { message: 'Máximo 1000 caracteres.' });

    required(schemaPath.foto, { message: 'Debe adjuntar una fotografía.' });
  }, {
    submission: {
      action: async () => {
        await this.publicar();
      },
      onInvalid: () => {
        this.pubForm().markAsTouched();
      }
    }
  });

  constructor() {
    // Si el usuario quiere cerrar con datos cargados, pide confirmación
    this._ref.disableClose = true;
    this._ref.backdropClick().subscribe(() => this.cancelar());
    this._ref.keydownEvents().subscribe(e => {
      if (e.key === 'Escape') this.cancelar();
    });
  }

  async seleccionarFoto(event: Event): Promise<void> {
    const archivo = (event.target as HTMLInputElement).files?.[0];
    this.errorFoto.set(null);
    this.pubForm.foto().markAsTouched();
    if (!archivo) return;

    if (!TIPOS_PERMITIDOS.includes(archivo.type)) {
      this.errorFoto.set('La fotografía debe ser JPG, PNG o WEBP.');
      return;
    }
    if (archivo.size > TAMANIO_MAXIMO_ARCHIVO) {
      this.errorFoto.set('La fotografía no puede superar los 10 MB.');
      return;
    }

    this.procesandoFoto.set(true);
    try {
      const base64 = await this.reducirImagen(archivo);
      this.datos.update(d => ({ ...d, foto: base64, tipoFoto: 'image/jpeg' }));
    }
    catch {
      this.errorFoto.set('No fue posible leer la imagen seleccionada.');
    }
    finally {
      this.procesandoFoto.set(false);
    }
  }

  cancelar(): void {
    if (!this.pubForm().dirty() || this.pubForm().submitting()) {
      this._ref.close();
      return;
    }
    this._dialog.open(ModalConfirmar, {
      data: {
        titulo: 'Descartar publicación',
        texto: 'Los datos ingresados se perderán. ¿Desea salir sin publicar?',
        textoAceptar: 'Descartar',
        claseBoton: 'btn-danger'
      },
      width: '400px',
      maxWidth: '95vw',
      panelClass: 'dialog-mc'
    }).afterClosed().subscribe(ok => {
      if (ok) this._ref.close();
    });
  }

  private async publicar(): Promise<void> {
    this.error.set(null);
    const d = this.datos();
    const data: IPublicacionData = {
      nombre: d.nombre.trim(),
      nroValorEspecie: Number(d.especie),
      sexo: d.sexo as 'M' | 'H',
      edadAproximada: d.edad === '' ? null : Number(d.edad),
      raza: d.raza.trim() || null,
      caracteristicasMascota: d.caracteristicas.trim(),
      condicionAdopcion: d.condicion.trim(),
      foto: d.foto,
      tipoFoto: d.tipoFoto
    };
    try {
      const creada = await firstValueFrom(this._api.insPublicacion(data));
      this._ref.close(creada);
    }
    catch (e) {
      const err = e as HttpErrorResponse;
      if (err.status === 401) return; // authInterceptor, redirige al login
      this.error.set(err.status === 0
        ? 'No fue posible conectarse con el servicio.'
        : err.error?.message ?? 'No fue posible registrar la publicación.');
    }
  }

  /**
   * Achica la imagen (lado máximo 1280 px) y la convierte a JPEG.
   * Así una foto de celular de varios MB queda en unos cientos de KB
   * y no supera el límite de 2 MB del backend.
   */
  private reducirImagen(archivo: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const url = URL.createObjectURL(archivo);
      const img = new Image();
      img.onload = () => {
        const escala = Math.min(1, LADO_MAXIMO_FOTO / Math.max(img.width, img.height));
        const canvas = document.createElement('canvas');
        canvas.width = Math.round(img.width * escala);
        canvas.height = Math.round(img.height * escala);
        const ctx = canvas.getContext('2d')!;
        ctx.fillStyle = '#ffffff'; // fondo blanco para PNG con transparencia
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        URL.revokeObjectURL(url);
        resolve(canvas.toDataURL('image/jpeg', 0.85).split(',')[1]);
      };
      img.onerror = () => {
        URL.revokeObjectURL(url);
        reject();
      };
      img.src = url;
    });
  }

  private nuevaPublicacion(): IPublicacionForm {
    return {
      nombre: '',
      especie: '',
      sexo: '',
      edad: '',
      raza: '',
      caracteristicas: '',
      condicion: '',
      foto: '',
      tipoFoto: ''
    };
  }

}