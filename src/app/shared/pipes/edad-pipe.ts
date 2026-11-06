import { Pipe, PipeTransform } from '@angular/core';

// 0 -> "Menos de 1 año", 1 -> "1 año", 4 -> "4 años", null -> "Edad desconocida"
@Pipe({
  name: 'edad',
})
export class EdadPipe implements PipeTransform {

  transform(edad: number | null | undefined): string {
    if (edad === null || edad === undefined) return 'Edad desconocida';
    if (edad <= 0) return 'Menos de 1 año';
    return edad === 1 ? '1 año' : `${edad} años`;
  }

}
