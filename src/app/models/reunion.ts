import { EstadoReunion } from "./estado-reunion";
import { Oficina } from "./oficina";
import { Participante } from "./participante";
import { Recurso } from "./recurso";
import { TipoReunion } from "./tipo-reunion";

export class Reunion {
    _id!: string;
    fecha!: string;
    horaReunion!: string;
    horaFinalizacion!:string;
    tipoReunion!: TipoReunion;
    estadoReunion!: EstadoReunion;
    oficina!: Oficina;
    participantes!: Array <Participante>;
    recursos!: Array <Recurso>;
    prioridad!: number;
    codigoQr!:string;
}



