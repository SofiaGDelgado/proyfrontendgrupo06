import { Empleado } from "./empleado";
import { Reunion } from "./reunion";

export class Administrador {
    _id!: string
    empleado!: Empleado;
    reuniones!: Reunion;
    notificaciones!: Array <Notification> ;
    cantidadReuniones!: number;
    
}
