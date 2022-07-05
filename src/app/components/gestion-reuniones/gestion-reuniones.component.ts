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
  oficinaSelected!: string;
  oficinas: any[] = [
    {value: '62bb40ddfde8bd3ec266c924', nombre: 'Oficina 1'},
    {value: '62c21b70993a0e1b6211b69c', nombre: 'Oficina 2'},
    {value: '62c21b5e993a0e1b6211b69a', nombre: 'Oficina 3'},
  ] 
  participanteSelected!: string;
  participantes: any[] = [
    {value: '62c19fb981890552faac3850', nombre: 'Juan Perez'},
    {value: '62c1b83a81890552faac3869', nombre: 'Enzo Castillo'},
  ] 
  // //Modal
  // @ViewChild('modalContent', { static: true }) modalContent!: TemplateRef<any>;

  // modalData!: {
  //   tipoReunion: string;
  //   oficina: Oficina;
  //   participantes:  Array <Empleado>;
  //   recursos: Array <Recurso>;
  //   prioridad: number;
  //   codigoQr: string;
  //   notificacion: Array<Notificacion>;
  // };
  
  constructor(private reunionService: ReunionService, private modal: NgbModal, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cargarReuniones();
  }

  cargarReuniones(){
    this.reunionService.getReuniones().subscribe(
      result=>{
        console.log(result);
        var reunion= new Reunion();
        this.reuniones=new Array <Reunion>();
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          console.log(reunion);
          this.reuniones.push(reunion);
          reunion= new Reunion();
        });
        console.log(this.reuniones);
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
  // verDetalle(r: Reunion){
  //   this.modalData = {
  //     tipoReunion: r.tipoReunion.nombre,
  //     oficina: r.oficina,
  //     participantes:  r.participantes,
  //     recursos: r.recursos,
  //     prioridad: r.prioridad,
  //     codigoQr: r.codigoQr,
  //     notificacion: r.notificacion
  //   };
  //   this.modal.open(this.modalContent, { size: 'md' });
  // }
  
  busquedaPorOficina(){
    this.reunionService.getReunionesOficina(this.oficinaSelected).subscribe(
      (result)=>{
        this.reuniones = result;
        console.log();
      }
    )
  }

  busquedaPorParticipantes(){
    this.reunionService.getReunionesEmpleado(this.participanteSelected).subscribe(
      (result)=>{
        this.reuniones = result;
        console.log();
      }
    )
  }
}
