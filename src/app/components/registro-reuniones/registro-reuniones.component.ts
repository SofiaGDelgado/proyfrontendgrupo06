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
import { Router } from '@angular/router';
import { GeneradorQrService } from 'src/app/services/generador-qr.service';

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

  constructor(private reunionService: ReunionService, private empleadoServ: EmpleadoService,
                  private recursoServ: RecursoService, private notificacionServ: NotificacionService,
                  private router: Router, private genQR: GeneradorQrService) { 
    this.reunion = new Reunion();
    this.recurso = new Recurso();
    this.notificacion = new Notificacion();
    this.getParticipantes();
    this.getTipoReunion();
    this.getOficinas();
  }

  ngOnInit(): void {
  }

  getTipoReunion(){
    this.tiposReunion = new Array<TipoReunion>();
    this.reunionService.getTiposReunion().subscribe((tR)=> {
      this.tiposReunion = tR;
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

  buscarNotificacion(){

  }

  crearNotificacion(){
    this.notificacion.titulo = this.reunion.nombre;
    this.notificacion.descripcion = this.reunion.descripcion;
    this.notificacion.estado = "activa";

    this.notificacionServ.addNotificacion(this.notificacion).subscribe((n) => {
      console.log(n);
      this.notificacion = new Notificacion();
    });

    this.notificacionServ.getNotificaciones().subscribe((nots) => {
      this.notificacion = nots[nots.length - 1];
      console.log(this.notificacion);
      this.reunion.notificacion.push(this.notificacion);
    });
  }

  registrarReunion(){
    this.reunionService.addReunion(this.reunion).subscribe((r) => {
      console.log(r);
      this.reunion = new Reunion();
    });

    this.reunionService.getReuniones().subscribe((reu)=>{
      this.reunion = reu[reu.length - 1];
    });
    this.crearNotificacion();

    this.generarQR("http://localhost:4200/detalle/reunion/" + this.reunion._id);

    this.generarPDF();

    this.cargarReunionEmpleado();

   // this.router.navigate(['http://localhost:4200/detalle/reunion/' , this.reunion._id]);

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

  cargarReunionEmpleado(){
    for(var i=0; i < this.reunion.participantes.length; i++){
      this.reunion.participantes[i].reuniones.push(this.reunion);
      this.reunion.participantes[i].notificaciones.push(this.reunion.notificacion[0]);
      this.empleadoServ.modificarEmpleado(this.reunion.participantes[i]).subscribe((e)=>{
        console.log(e);
      });
    }
  }

  modificarReunion(){
    this.reunionService.modificarReunion(this.reunion).subscribe((r) => {
      console.log(r);
    })
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
  
}
