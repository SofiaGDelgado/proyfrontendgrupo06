import { Dependencia } from "./dependencia";

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
    
}
