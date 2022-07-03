import {OnInit, Component, ChangeDetectionStrategy, ViewChild, TemplateRef,} from '@angular/core';
import { startOfDay, endOfDay, subDays, addDays, endOfMonth, isSameDay, isSameMonth, addHours,} from 'date-fns';
import { Subject } from 'rxjs';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CalendarEvent, CalendarEventAction, CalendarEventTimesChangedEvent,CalendarView,} from 'angular-calendar';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';


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
  };

  actions: CalendarEventAction[] = [
    {
      label: '', //<i class="fas fa-fw fa-pencil-alt"></i>
      a11yLabel: 'Edit',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.handleEvent('Edited', event);
      },
    },
    {
      label: '', //<i class="fas fa-fw fa-trash-alt"></i>
      a11yLabel: 'Delete',
      onClick: ({ event }: { event: CalendarEvent }): void => {
        this.events = this.events.filter((iEvent) => iEvent !== event);
        this.handleEvent('Deleted', event);
      },
    },
  ];

  refresh = new Subject<void>();

  //Aca se agregan los eventos
  events: CalendarEvent[] = [
    {
      title: 'Reunion equipo A',
      color: colors.red, 
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
      
     
      
      
    
    },
    
  ];
  

  activeDayIsOpen: boolean = true;

  constructor(private modal: NgbModal, private reunionService: ReunionService) {}

  ngOnInit(): void {
    this.cargarReuniones();
  }

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
        
      },
      error=>{

      }
    );
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

  addEvent(): void {
    this.events = [
      ...this.events,
      {
        title: 'New event',
        start: startOfDay(new Date()),
        end: endOfDay(new Date()),
        color: colors.red,
        draggable: true,
        resizable: {
          beforeStart: true,
          afterEnd: true,
        },
      },
    ];
  }

  deleteEvent(eventToDelete: CalendarEvent) {
    this.events = this.events.filter((event) => event !== eventToDelete);
  }

  setView(view: CalendarView) {
    this.view = view;
  }

  closeOpenMonthViewDay() {
    this.activeDayIsOpen = false;
  }
  
}
