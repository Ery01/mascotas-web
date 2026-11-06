// Datos para dar de alta una publicación (PublicacionDataBE del backend)
export interface IPublicacionData {
  nombre: string;
  nroValorEspecie: number;
  sexo: 'M' | 'H';
  edadAproximada: number | null;
  raza: string | null;
  caracteristicasMascota: string;
  condicionAdopcion: string;
  foto: string;          // Base64 sin el prefijo "data:image/...;base64,"
  tipoFoto: string;
}