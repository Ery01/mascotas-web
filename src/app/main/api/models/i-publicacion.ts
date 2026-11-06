export type EstadoPublicacion = 'Activa' | 'Pausada' | 'Finalizada';

// Publicación de adopción
export interface IPublicacion {
  nroPublicacion: number;
  nroRegMunicipal: string;
  nombre: string;
  especie: string | null;
  sexo: 'M' | 'H';
  edad: number | null;
  raza: string | null;
  caracteristicasMascota: string;
  condicionAdopcion: string;
  foto: string;          // Base64
  tipoFoto: string;      // image/jpeg, image/png, image/webp
  estadoPublicacion: EstadoPublicacion;
  fechaPublicacion: string;
}
