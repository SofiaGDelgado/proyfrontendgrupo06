import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { Empleado } from 'src/app/models/empleado';
import { Notificacion } from 'src/app/models/notificacion';
import { Oficina } from 'src/app/models/oficina';
import { Recurso } from 'src/app/models/recurso';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-gestion-reuniones',
  templateUrl: './gestion-reuniones.component.html',
  styleUrls: ['./gestion-reuniones.component.css']
})
export class GestionReunionesComponent implements OnInit {

  reuniones!: Array <Reunion>;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<any> = new Subject<any>();
  
  //Modal
  @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  modalData!: {
    tipoReunion: string;
    oficina: Oficina;
    participantes:  Array <Empleado>;
    recursos: Array <Recurso>;
    prioridad: number;
    codigoQr: string;
    notificacion: Array<Notificacion>;
  };
  
  constructor(private reunionService: ReunionService, private modal: NgbModal, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 5
    };
    this.cargarReuniones();
  }

  ngOnDestroy(): void {
    // Do not forget to unsubscribe the event
    this.dtTrigger.unsubscribe();
  }

  cargarReuniones(){
    this.reunionService.getReuniones().subscribe(
      result=>{
        var reunion= new Reunion();
        this.reuniones=new Array <Reunion>();
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          this.reuniones.push(reunion);
        });
        // this.dtTrigger.next();
      },
      error=>{

      }
    );
  }
  altaReunion(){
    this.router.navigate(['principal/Administrador/gestionReuniones/formReunion', 0]);
  }

  modificarReunion(r: Reunion){
    this.router.navigate(['principal/Administrador/gestionReuniones/formReunion', r._id]);
  }

  borrarReunion(r: Reunion){
    var id:string= r._id;
    this.reunionService.deleteReunion(id).subscribe(
      result=>{
          this.cargarReuniones();
          this.toastr.success('Operacion exitosa','Exito',{
            extendedTimeOut:3000});

      },
      error=>{
       
          this.toastr.error('Error');        
      }
     );
  }
  verDetalle(r: Reunion){
    this.modalData = {
      tipoReunion: r.tipoReunion.nombre,
      oficina: r.oficina,
      participantes:  r.participantes,
      recursos: r.recursos,
      prioridad: r.prioridad,
      codigoQr: r.codigoQr,
      notificacion: r.notificacion
    };
    this.modal.open(this.modalContent, { size: 'md' });
  }
  

}
