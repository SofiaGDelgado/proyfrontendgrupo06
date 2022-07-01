import { Dependencia } from "./dependencia";
import { Notificacion } from "./notificacion";
import { Reunion } from "./reunion";

export class Empleado {
    _id!: string;
    apellido!: string;
    nombre!: string;
    legajo!: string;
    email!: string;
    dependencia!: Dependencia;
    username!: string;
    password !: string;
    rol !:string;
    reuniones!: Array<Reunion>;
    notificaciones!: Array <Notificacion>;
    cantidadReuniones!: number;
    estadoEmpleado!: boolean;

    constructor(){
        
        this.cantidadReuniones = 0;
        this.estadoEmpleado = true;
    }

}
