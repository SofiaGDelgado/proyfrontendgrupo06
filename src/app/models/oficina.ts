export class Oficina {
    _id!: string;
    reuniones!: Array<Reunion>;
    número!:number;
    horarioAbierto!:string;
    horarioCierre!:string;
    diasFuncionamiento!: string;
    piso!:number;
    edificio!: string;
    cantidadReuniones!: number;

    constructor(){
        
    }

}
