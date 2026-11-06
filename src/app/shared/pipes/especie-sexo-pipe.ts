import { Pipe, PipeTransform } from '@angular/core';

// Perro + H -> "Perra", Gato + H -> "Gata"
@Pipe({
  name: 'especieSexo',
})
export class EspecieSexoPipe implements PipeTransform {

  private readonly femeninos: Record<string, string> = {
    Perro: 'Perra',
    Gato: 'Gata',
    Conejo: 'Coneja',
  };

  transform(especie: string | null | undefined, sexo: string | null | undefined): string {
    if (!especie) return '';
    return sexo === 'H' ? (this.femeninos[especie] ?? especie) : especie;
  }

}