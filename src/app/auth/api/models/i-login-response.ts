import { IUsuarioSesion } from '../../../core/models/i-usuario-sesion';

export interface ILoginResponse {
  token: string;
  tipoToken: string;
  expiraEn: number;
  usuario: IUsuarioSesion;
}