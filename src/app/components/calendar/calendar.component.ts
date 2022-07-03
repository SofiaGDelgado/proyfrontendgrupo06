import {OnInit, Component, ChangeDetectionStrategy, ViewChild, TemplateRef,} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { startOfDay, endOfDay, subDays, addDays,   startOfMonth, endOfMonth, startOfWeek,
  endOfWeek, isSameDay, isSameMonth, addHours, format } from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,CalendarView,} from 'angular-calendar';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';
import { Oficina } from 'src/app/models/oficina';

//Colores para los eventos
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
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
  
})
export class CalendarComponent {
    
  //Variable para que el calendario aparezca en español
  locale: string = "es";

  //Modal
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  modalData!: {
    event: CalendarEvent;
  };

  //Variables para la vista
  view: CalendarView = CalendarView.Month;

  CalendarView = CalendarView;

  viewDate: Date = new Date();

  refresh = new Subject<void>();
  
  activeDayIsOpen: boolean = false;

  reunionesOficina!: Array <Reunion>;

  oficinas!: Array <Oficina>;

  oficina!:Oficina;

  //Aca se agregan los eventos
  events: CalendarEvent[]=[
    {
      //Ejemplo por defecto
      title: 'Reunion equipo A',
      color: colors.blue, 
      start: addHours(startOfDay(new Date()), 2),// horaReunion!: string;// fecha!: string;
      end: addHours(new Date(), 2),// horaFinalizacion!:string;
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
    }
  ];
    
  constructor(private modal: NgbModal, private reunionService: ReunionService) {}

  ngOnInit(): void {
    this.cargarReuniones();
  }
  // Cargar reuniones en calendario
  cargarReuniones(): void{
    
    var reunion: Reunion;

    this.reunionService.getReuniones().subscribe(
      result=>{
        var reunion= new Reunion();
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          
          this.agregarEvento(reunion);
        });
        console.log(this.events);
        this.refresh.next();
      },
      error=>{

      }
    );
  }
  //Metodo para agregar los eventos de la BD a events del calendario
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

  //Filtro por oficinas
  filtroOficinas(oficina: Oficina){
    this.reunionesOficina= new Array <Reunion>();
      this.reunionService.getReunionesOficina(oficina._id).subscribe(
        result=>{
          var reunion= new Reunion();
          result.forEach((element:any) => {
            Object.assign(reunion, element);
            
            this.agregarEvento(reunion);
          });
          console.log(this.events);
          
        },
        error=>{

        }
      );
  }
  //Metodo cargar select de Oficinas
  cargarOficinas(){
    this.oficinas= new Array <Oficina>();
    this.reunionService.getReunionesOficina(this.oficina._id).subscribe(
      result=>{
        var unaOficina= new Oficina();
        result.forEach((element:any) => {
          Object.assign(unaOficina, element);
          this.oficinas.push(unaOficina);
          unaOficina= new Oficina();
        });
        console.log(this.oficinas);
        if(this.oficinas.length == 0){
          alert('No se han encontrado coincidencias');
        }
        
      },
      error=>{

      }
    );
  }

  //Metodos de angular calendar

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

  eventTimesChanged({
    event,
    newStart,
    newEnd,
  }: CalendarEventTimesChangedEvent): void {
    this.events = this.events.map((iEvent) => {
      if (iEvent === event) {
        return {
          ...event,
          start: newStart,
          end: newEnd,
        };
      }
      return iEvent;
    });
    this.handleEvent('Dropped or resized', event);
  }

  handleEvent(action: string, event: CalendarEvent): void {
    this.modalData = {event};
    this.modal.open(this.modalContent, { size: 'md' });
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  
}
