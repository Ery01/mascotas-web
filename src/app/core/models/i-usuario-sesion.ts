export interface IUsuarioSesion {
  idCiudadano: number;
  cuil: string;
  apellido: string;
  nombre: string;
  rol: string;
  idRefugio?: number | null;
  idVeterinaria?: number | null;
  razonSocial?: string | null;
}
