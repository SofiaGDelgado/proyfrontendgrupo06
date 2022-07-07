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
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-gestion-reuniones',
  templateUrl: './gestion-reuniones.component.html',
  styleUrls: ['./gestion-reuniones.component.css']
})
export class GestionReunionesComponent implements OnInit {

  reuniones!: Array <Reunion>;
  oficinaSelected!: string;
  oficinas!: Array <Oficina>;
  participanteSelected!: string;
  participantes!: Array <Empleado>;
  
  constructor(private reunionService: ReunionService, private modal: NgbModal, private router: Router, private toastr: ToastrService, private empleadoServ: EmpleadoService) { }

  ngOnInit(): void {
    this.cargarReuniones();
    this.getOficinas();
    this.getParticipantes();
    this.participanteSelected="0";
  }

  cargarReuniones(){
    this.reunionService.getReuniones().subscribe(
      result=>{
        //console.log(result);
        var reunion= new Reunion();
        this.reuniones=new Array <Reunion>();
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          //console.log(reunion);
          this.reuniones.push(reunion);
          reunion= new Reunion();
        });
        //console.log(this.reuniones);
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
        this.toastr.success('Operacion exitosa','Exito', {extendedTimeOut:3000});
      },
      error=>{
        this.toastr.error('Error');        
      }
    );
  }

  verDetalle(r: Reunion){
    this.router.navigate(['detalle/reunion', r._id]);
  }
  
  busquedaPorOficina(){
    this.reunionService.getReunionesOficina(this.oficinaSelected).subscribe(
      (result)=>{
        this.reuniones = result;
      }
    )
  }

  busquedaPorParticipantes(){
    this.reunionService.getReunionesEmpleado(this.participanteSelected).subscribe(
      (result)=>{
        this.reuniones = result;
      }
    )
  }

  irCalendario(){
    this.router.navigate(['principal/Administrador/calendario']);
  }

  getOficinas(){
    this.oficinas = new Array<Oficina>();
    this.reunionService.getOficinas().subscribe((o) => {
      //this.oficinas = o;
      Object.assign(this.oficinas, o);
    })
  }

  getParticipantes(){
    this.participantes = new Array<Empleado>();
    this.empleadoServ.getEmpleados().subscribe((p) => {
      for(var i=0; i<p.length; i++){
        if(p[i].rol === 'participante'){
          this.participantes.push(p[i]);
        }
      }
    })
  }
}
