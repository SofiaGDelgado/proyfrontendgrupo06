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

  constructor(private reunionService: ReunionService, private empleadoServ: EmpleadoService,
    private recursoServ: RecursoService, private notificacionServ: NotificacionService,
    private router: Router, private genQR: GeneradorQrService,
    private envioMail: EnviomailService, private activatedRoute: ActivatedRoute, private toastr: ToastrService) { 
    this.reunion = new Reunion();
    this.recurso = new Recurso();
    this.notificacion = new Notificacion();
    this.remitentes = new Array<string>();
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
  }

  getTipoReunion(){
    this.tiposReunion = new Array<TipoReunion>();
    this.reunionService.getTiposReunion().subscribe((tR)=> {
      this.tiposReunion = tR;
      console.log(tR);
    })
  }

  getOficinas(){
    this.oficinas = new Array<Oficina>();
    this.reunionService.getOficinas().subscribe((o) => {
      this.oficinas = o;
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

  seleccionarParticipante(p: Empleado){
    this.reunion.participantes.push(p);
    console.log(this.reunion.participantes);
  }

  agregarNotificacionEmpleado(){
    this.notificacionServ.getNotificaciones().subscribe((nots) => {
      console.log(this.reunion.participantes);
      for(var i=0; i < this.reunion.participantes.length; i++){
        console.log(this.reunion.participantes[i].notificaciones);
        this.remitentes.push(this.reunion.participantes[i].email);
        this.reunion.participantes[i].notificaciones.push(nots[nots.length - 1]);
  
        this.modificarEmpleado(this.reunion.participantes[i]);
  
        console.log("array notificaciones empleado:", this.reunion.participantes[i].notificaciones)
      }
    });
  }

  crearNotificacion(){
    this.notificacion.titulo = this.reunion.nombre;
    this.notificacion.descripcion = this.reunion.descripcion;
    this.notificacion.estado = "activa";

    this.notificacionServ.addNotificacion(this.notificacion).subscribe((n) => {
      console.log(n);
      this.notificacion = new Notificacion();
    });

    this.agregarNotificacionEmpleado();
  }

  crearNotificacionReunion(){
    this.notificacionServ.getNotificaciones().subscribe((nots) => {
      this.notificacion = nots[nots.length - 1];
      console.log(this.notificacion);
      this.reunion.notificacion.push(this.notificacion);
    });
  }

  buscarReunion(){
    this.reunionService.getReuniones().subscribe((reu)=>{
      for(var i=0; i < this.reunion.participantes.length; i++){
        this.reunion.participantes[i].reuniones.push(reu[reu.length - 1]);

        this.modificarEmpleado(this.reunion.participantes[i]);
      }

      this.reunion = reu[reu.length - 1];
    });
  }

async registrarReunion(){
    this.reunionService.addReunion(this.reunion).subscribe((r) => {
      console.log(r);
      //this.reunion = new Reunion();
    });

    this.crearNotificacion();

    this.buscarReunion();

    this.crearNotificacionReunion();

    this.generarQR("http://localhost:4200/detalle/reunion/" + this.reunion._id);

    this.generarPDF();

    //await this.enviarMail();

    this.reunion= new Reunion();

    this.router.navigate(['detalle/reunion/', this.reunion._id]);

  }

  onFileChanges(files:any){
    console.log("File has changed:", files);
    this.recurso.archivoUrl = btoa(files[0].base64);
    console.log(this.recurso.archivoUrl);
  }

  cargarRecurso(){
    this.recursoServ.addRecurso(this.recurso).subscribe((r) => {
      console.log(r);
      this.recurso = new Recurso();
    })

    this.recursoServ.getRecursos().subscribe((rec)=> {
      var recur = new Recurso();
      recur = rec[rec.length - 1];
      this.reunion.recursos.push(recur);
    })
  }

  generarQR(url: string){
    this.genQR.getQr(url).subscribe((qr)=> {
      this.reunion.codigoQr = qr.qr;
      this.modificarReunion();
    })
  }

  modificarEmpleado(par: Empleado){
    this.empleadoServ.modificarEmpleado(par).subscribe((e)=>{
      console.log(e);
    });
  }

  cargarReunionEmpleado(){
    for(var i=0; i < this.reunion.participantes.length; i++){
      this.reunion.participantes[i].reuniones.push(this.reunion);
      this.modificarEmpleado(this.reunion.participantes[i]);
    }
  }

  modificarReunion(){
    this.reunionService.modificarReunion(this.reunion).subscribe((r) => {
      console.log(r);
      this.reunion = new Reunion();
      this.reunionService.getReuniones().subscribe((reu)=>{
        this.reunion = reu[reu.length - 1];
      });
    });
  }

  generarPDF(){
    const pdf = new PdfMakeWrapper();
    
    pdf.add(new Txt(this.reunion.nombre).end) ;

    pdf.add(new Img(this.reunion.codigoQr).end);

    pdf.create().open();
  }

  eliminarParticipante(participante: Empleado){
    const par = this.reunion.participantes.filter(p => p._id !== participante._id);

    this.reunion.participantes = par;
  }

  quitarRecurso(recurso : Recurso){
    const r = this.reunion.recursos.filter(r => r._id !== recurso._id);
    this.reunion.recursos = r;

    this.recursoServ.deleteRecurso(recurso).subscribe(rec => {
      console.log(rec);
    })
  }

 async enviarMail(){

    var asunto = "Nueva Reunion";
    var mensaje = "Se te asigno a la reunion: " + this.reunion.nombre + "A realizarse: " + this.reunion.fecha;

    for(var i=0 ; i < this.remitentes.length; i++){
      this.envioMail.sendMail(this.remitentes[i], asunto, mensaje, this.reunion.codigoQr).subscribe((r)=> {
        console.log(r);
      })
    }

  }

  cargarReunion(id: string){
    this.reunionService.getReunion(id).subscribe(
      result=>{
        this.reunion= new Reunion();
        Object.assign(this.reunion, result);
        this.reunion.tipoReunion= this.tiposReunion.find((item)=>(item._id == this.reunion.tipoReunion._id ))!;
        this.reunion.oficina= this.oficinas.find((item)=>(item._id == this.reunion.oficina._id ))!;
      }
    )
  }
  
}
