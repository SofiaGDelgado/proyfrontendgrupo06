import { Reunion } from "./reunion";

export class Oficina {
    _id!: string;
    nombre!:string;
    reuniones!: Array<Reunion>;
    numero!:number;
    piso!:number;
    edificio!: string;

    constructor(){
        this.reuniones = new Array<Reunion>();
    }

}
