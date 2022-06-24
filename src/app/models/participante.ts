import { Empleado } from "./empleado";
import { Reunion } from "./reunion";

export class Participante {
    _id!: string
    empleado!: Empleado;
    reuniones!: Reunion;
    notificaciones!: Array <Notification> ;
    cantidadReuniones!: number;
    
}
