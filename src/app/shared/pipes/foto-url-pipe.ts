import { Pipe, PipeTransform } from '@angular/core';

// La foto llega del backend en Base64: la convierte en una URL que entiende <img>
@Pipe({
  name: 'fotoUrl',
})
export class FotoUrlPipe implements PipeTransform {

  transform(base64: string | null | undefined, tipo: string | null | undefined): string {
    return base64 ? `data:${tipo || 'image/jpeg'};base64,${base64}` : '';
  }

}