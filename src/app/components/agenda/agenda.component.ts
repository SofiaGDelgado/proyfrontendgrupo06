import {OnInit, Component, ChangeDetectionStrategy, ViewChild, TemplateRef,} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,CalendarView,} from 'angular-calendar';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';
import { LoginService } from 'src/app/services/login.service';
<<<<<<< HEAD
=======
import { Router } from '@angular/router';
>>>>>>> 3390c04bb03262ae5f2f116d492b006f9eab7817

const colors: any = {
  red: {
    primary: '#ad2121',
    secondary: '#FAE3E3',
  },
  blue: {
    primary: '#1e90ff',
    secondary: '#D1E8FF',
  },
  yellow: {
    primary: '#e3bc08',
    secondary: '#FDF1BA',
  },
};

@Component({
  selector: 'app-agenda',
  templateUrl: './agenda.component.html',
  styleUrls: ['./agenda.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})

export class AgendaComponent implements OnInit {
  
  locale: string = "es";

  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  modalData!: {
    event: CalendarEvent;
    nombre: string;
    inicio: Date;
    fin: any;
    codigoQr: string;
<<<<<<< HEAD
=======
    id: string;
>>>>>>> 3390c04bb03262ae5f2f116d492b006f9eab7817
  };

 
  refresh = new Subject<void>();

  //Aca se agregan los eventos
<<<<<<< HEAD
  events: CalendarEvent[]= [
    {
      title: 'Reunion equipo A',
      color: colors.blue, 
      start: new Date(),// horaReunion!: string;// fecha!: string;
     // horaFinalizacion!:string;
      meta:{
        oficina: "oficina 1",// oficina!: Oficina;
        tipoReunion: "Oficial",// tipoReunion!: TipoReunion;
        estadoReunion: "Pendiente",// estadoReunion!: string;
        participante: "Laura Lozano, Pedro Perez, Rolando Diaz",// participantes!: Array <Empleado>;
        recursos:"Word y PDF",// recursos!: Array <Recurso>;
        prioridad: "3",// prioridad!: number;
        codigoQr: "", // codigoQr!:string;
        notificacion: "Titulo, mensaje"// notificacion!: Array<Notificacion>;
      }
 
    },
    
  ];
  
  activeDayIsOpen: boolean = true;

  idEmpleado!: any;

  constructor(private modal: NgbModal, private reunionService: ReunionService, private loginService: LoginService) {}

  ngOnInit(): void {
    this.cargarReuniones();
    this.obtenerId();
  }

  cargarReuniones(): void{

    this.reunionService.getReunionesEmpleado(this.idEmpleado).subscribe(
      result=>{
        var reunion= new Reunion();
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          
          this.agregarEvento(reunion);
=======
  events!: CalendarEvent[];
  
  activeDayIsOpen: boolean = false;

  idEmpleado!: any;

  idReunion!:string;

  constructor(private modal: NgbModal, private reunionService: ReunionService, private loginService: LoginService, private router: Router) {}

  ngOnInit(): void {
    this.cargarReuniones();
   
  }

  cargarReuniones(): void{
    this.obtenerId();
    this.reunionService.getReunionesEmpleado(this.idEmpleado).subscribe(
      result=>{
        var reunion= new Reunion();
        this.events=[];
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          this.agregarEvento(reunion);
          reunion= new Reunion();
>>>>>>> 3390c04bb03262ae5f2f116d492b006f9eab7817
        });
        console.log(this.events);
        this.refresh.next();
      },
      error=>{

      }
    );
  }

  obtenerId(){
    this.idEmpleado= this.loginService.idLogged();
    console.log(this.idEmpleado);
  }
  //
  agregarEvento(reunion: Reunion):void{
    var [year, month, day]= reunion.fecha.split('-');
    var [hours, minutes]= reunion.horaReunion.split(':');
    var [hours1, minutes1]= reunion.horaFinalizacion.split(':');
    var[seconds]='00';
    var[seconds1]='00';
    const eventoAux: CalendarEvent={
       title: reunion.nombre,
              start: new Date(+year, +month-1, +day, +hours, +minutes, +seconds),
              end: new Date(+year, +month-1, +day, +hours1, +minutes1, +seconds1),
              color:colors.blue,
              meta:{
                reunion
              }
    };
    this.events = [...this.events,eventoAux];
  }
  
  dayClicked({ date, events }: { date: Date; events: CalendarEvent[] }): void {
    if (isSameMonth(date, this.viewDate)) {
      if (
        (isSameDay(this.viewDate, date) && this.activeDayIsOpen === true) ||
        events.length === 0
      ) {
        this.activeDayIsOpen = false;
      } else {
        this.activeDayIsOpen = true;
      }
      this.viewDate = date;
    }
  }

  

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {
      event: event,
      nombre: event.title,
      inicio: event.start,
      fin: event.end,
<<<<<<< HEAD
      codigoQr: event.meta.codigoQr
    };
=======
      codigoQr: event.meta.reunion.codigoQr,
      id:event.meta.reunion._id
    };
    console.log(this.modalData);
    this.idReunion= this.modalData.id;
>>>>>>> 3390c04bb03262ae5f2f116d492b006f9eab7817
    this.modal.open(this.modalContent, { size: 'md' });
  }


  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  
  verDetalle(){
    
    this.router.navigate(['detalle/reunion', this.idReunion]);
  }
}
