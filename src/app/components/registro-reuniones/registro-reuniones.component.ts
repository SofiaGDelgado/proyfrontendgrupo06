import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { Notificacion } from 'src/app/models/notificacion';
import { Oficina } from 'src/app/models/oficina';
import { Recurso } from 'src/app/models/recurso';
import { Reunion } from 'src/app/models/reunion';
import { TipoReunion } from 'src/app/models/tipo-reunion';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { NotificacionService } from 'src/app/services/notificacion.service';
import { RecursoService } from 'src/app/services/recurso.service';
import { ReunionService } from 'src/app/services/reunion.service';
import { Img, PdfMakeWrapper, Txt } from 'pdfmake-wrapper';
import { ActivatedRoute, Router } from '@angular/router';
import { GeneradorQrService } from 'src/app/services/generador-qr.service';
import { EnviomailService } from 'src/app/services/enviomail.service';
import { ToastrService } from 'ngx-toastr';
import { daysToWeeks } from 'date-fns';

@Component({
  selector: 'app-registro-reuniones',
  templateUrl: './registro-reuniones.component.html',
  styleUrls: ['./registro-reuniones.component.css']
})
export class RegistroReunionesComponent implements OnInit {

  reunion!: Reunion;
  tiposReunion!: Array<TipoReunion>;
  oficinas!: Array<Oficina>;
  participantes!: Array<Empleado>;
  recurso!:Recurso;
  notificacion!: Notificacion;
  remitentes!: Array<string>;
  accion: string = "new";
  minDate: any;
  reunionValida!: boolean;
  colisionOficina!:boolean;

  constructor(private reunionService: ReunionService, private empleadoServ: EmpleadoService,
    private recursoServ: RecursoService, private notificacionServ: NotificacionService,
    private router: Router, private genQR: GeneradorQrService,
    private envioMail: EnviomailService, private activatedRoute: ActivatedRoute, private toastr: ToastrService) { 
    this.reunion = new Reunion();
    this.recurso = new Recurso();
    this.notificacion = new Notificacion();
    this.getParticipantes();
    this.getTipoReunion();
    this.getOficinas();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] == "0"){
        this.accion = "new";
      }else{
        this.accion = "update";
        this.cargarReunion(params['id']);
      }
    });
    this.desabilitarFechaAnteriores();
  }

  /* TIPO DE REUNION */
  getTipoReunion(){
    this.tiposReunion = new Array<TipoReunion>();
    this.reunionService.getTiposReunion().subscribe((tR)=> {
      this.tiposReunion = tR;
      console.log(tR);
    })
  }

  /* OFICINAS */
  getOficinas(){
    this.oficinas = new Array<Oficina>();
    this.reunionService.getOficinas().subscribe((o) => {
      this.oficinas = o;
    })
  }

  /* PARTICIPANTES */
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

  seleccionarParticipante(p: Empleado, $event: MouseEvent){
    ($event.target as HTMLButtonElement).disabled = true;
    this.reunion.participantes.push(p);
  }

  eliminarParticipante(participante: Empleado){
    const par = this.reunion.participantes.filter(p => p._id !== participante._id);
    this.reunion.participantes = par;
  }

  /* RECURSOS */
  cargarRecurso(){
    this.recursoServ.addRecurso(this.recurso).subscribe((r) => {
      this.recurso = new Recurso();
    })
    this.recursoServ.getRecursos().subscribe((rec)=> {
      var recur = new Recurso();
      recur = rec[rec.length - 1];
      this.reunion.recursos.push(recur);
    })
  }

  quitarRecurso(recurso : Recurso){
    const r = this.reunion.recursos.filter(r => r._id !== recurso._id);
    this.reunion.recursos = r;
    this.recursoServ.deleteRecurso(recurso).subscribe(rec => {
      console.log(rec);
    })
  }

  /* CRUD REUNIONES */
  registrarReunion(){
    this.compararHoras();
    if (this.reunionValida == false){
      this.toastr.error('La hora de finalizacion de la reunion tiene que ser mayor que la de inicio');
    } else{
      this.reunionService.addReunion(this.reunion).subscribe((r) => {
        console.log(r);
        //this.reunion = new Reunion();
        this.toastr.success('Reunion creada exitosamente');
      });
      this.crearNotificacion();
      this.buscarReunion();
      this.crearNotificacionReunion();
      var url:string="http://localhost:4200/detalle/reunion/" + this.reunion._id;
      this.generarQR(url);
      console.log("reunion luego de modificar: ", this.reunion);
      this.router.navigate(['principal/Administrador/gestionReuniones']);
    }
  }

  buscarReunion(){
    this.reunionService.getReuniones().subscribe((reu)=>{
      for(var i=0; i < this.reunion.participantes.length; i++){
        this.reunion.participantes[i].reuniones.push(reu[reu.length - 1]);
        this.modificarEmpleado(this.reunion.participantes[i]);
      }
      console.log(this.reunion.oficina);
      this.reunion.oficina.reuniones.push(reu[reu.length - 1]);
      this.reunionService.modificarOficina(this.reunion.oficina).subscribe((of) =>{
      console.log(of);
      });
      this.reunion = reu[reu.length - 1];
    });
  }

  modificarReunion(){
    this.reunionService.modificarReunion(this.reunion).subscribe((r) => {
      console.log(r);
      this.reunion = new Reunion();
      this.reunionService.getReuniones().subscribe((reu)=>{
        this.reunion = reu[reu.length - 1];
        //this.toastr.success('Se ha modificado con exito');
        //this.router.navigate(['principal/Administrador/gestionReuniones']);
      });
    })
  }

  cargarReunion(id: string){
    this.reunion.recursos= [];
    this.reunion.participantes=[];
    this.reunionService.getReunion(id).subscribe(
      result=>{
        this.reunion= new Reunion();
        Object.assign(this.reunion, result);
        this.reunion.tipoReunion= this.tiposReunion.find((item)=>(item._id == this.reunion.tipoReunion._id ))!;
        this.reunion.oficina= this.oficinas.find((item)=>(item._id == this.reunion.oficina._id ))!;
        console.log(this.reunion);
      }
    )
  }

  cargarReunionOficina(){
    this.reunion.oficina.reuniones.push(this.reunion);
    this.reunionService.modificarOficina(this.reunion.oficina).subscribe((of) =>{
      console.log(of);
    });
  }

  cargarReunionEmpleado(){
