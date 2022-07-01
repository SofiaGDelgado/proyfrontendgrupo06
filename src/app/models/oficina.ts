import { Reunion } from "./reunion";

export class Oficina {
    _id!: string;
    nombre!:string;
    reuniones!: Array<Reunion>;
    numero!:number;
    horarioAbierto!:string;
    horarioCierre!:string;
    diasFuncionamiento!: string;
    piso!:number;
    edificio!: string;
    cantidadReuniones!: number;

    constructor(){
        
    }

}
