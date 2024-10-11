import { TipoIdentificacion } from "./tipo-identificacion";
import { TipoProveedor } from "./tipo-proveedor";

export class Proveedor {
    id: number;
    nombre: string;
    apellido: string;
    telefono: number;
    email: string;
    direccion: string;
    razonSocial: string;
    fechaCreacion: Date;
    numeroIdentificacion: number;
    tipoIdentificacionId: TipoIdentificacion;
    tipoProveedorId: TipoProveedor;
}