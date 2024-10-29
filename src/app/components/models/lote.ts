import { Especie } from "./especie";
import { Proveedor } from "./proveedor";
import { UnidadProductiva } from "./unidad-productiva";

export class Lote {
    id: number;
    fechaRegistro: Date;
    lote: string;
    fechaSiembra: string;
    diasCultivados: number;
    numeroPeces: number;
    pecesIniciales: number;
    unidadProductiva: UnidadProductiva;
    especie: Especie;
    proveedor: Proveedor;
    especieId: number;
    unidadProductivaId: number;
    proveedorId: number;
    especieEspecie: string;
    unidadProductivaUnidadP: string;
    proveedorRazonSocial: string;
}
    