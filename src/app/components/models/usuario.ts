import { Rol } from "./rol";
export class Usuario {
    id: number;
    usuario: string;
    password: string;
    confirmPassword: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: number;
    rol: Rol;
}