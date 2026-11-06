import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filtra una lista por uno o más campos.
 * Uso: lista | filtrarPor:['nombre', 'raza']:textoBuscado
 */
@Pipe({
  name: 'filtrarPor',
})
export class FiltrarPorPipe implements PipeTransform {

  transform<T>(values: T[], campos: string | string[], filtro: string): T[] {
    if (!filtro || !filtro.trim()) {
      return values;
    }
    const keys = Array.isArray(campos) ? campos : [campos];
    const texto = this.normalizar(filtro);
    return values.filter(item =>
      keys.some(key => this.normalizar(String((item as Record<string, unknown>)[key] ?? '')).includes(texto))
    );
  }

  // Ignora mayúsculas y tildes
  private normalizar(valor: string): string {
    return valor.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase().trim();
  }

}