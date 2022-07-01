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
import { PdfMakeWrapper } from 'pdfmake-wrapper';
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

  constructor(private reunionService: ReunionService, private empleadoServ: EmpleadoService,
                  private recursoServ: RecursoService, private notificacionServ: NotificacionService,
                  private router: Router, private genQR: GeneradorQrService) { 
    this.reunion = new Reunion();
    this.recurso = new Recurso();
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
        var part = new Empleado();
        if(p[i].rol === 'participante'){
          part = p[i];
          this.participantes.push(part);
        }
      }
    })
  }

  seleccionarParticipante(p: Empleado){
    this.reunion.participantes.push(p);
    console.log(this.reunion.participantes);
  }

  crearNotificacion(){
    var not = new Notificacion();
    not.titulo = this.reunion.nombre;
    not.descripcion = this.reunion.descripcion;
    not.estado = "activa";

    this.notificacionServ.addNotificacion(not).subscribe((n) => {
      console.log(n);
      not = new Notificacion();
    });

    this.notificacionServ.getNotificaciones().subscribe((nots) => {
      var notificacion = new Notificacion();
      notificacion = nots[nots.length - 1];
      console.log(notificacion);
      this.reunion.notificacion.push(notificacion);

      console.log(this.reunion.notificacion);
    });
  }

  registrarReunion(){
    this.crearNotificacion();
    this.reunionService.addReunion(this.reunion).subscribe((r) => {
      console.log(r);
      this.reunion = new Reunion();
      this.generarPDF();
    });

    this.reunionService.getReuniones().subscribe((reu)=>{
      this.reunion = reu[reu.length - 1];
    })

    this.generarQR("http://localhost:4200/detalle/reunion/" + this.reunion._id);

    this.router.navigateByUrl("http://localhost:4200/detalle/reunion/"+this.reunion._id);
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

  modificarReunion(){
    this.reunionService.modificarReunion(this.reunion).subscribe((r) => {
      console.log(r);
    })
  }

  generarPDF(){
    const pdf = new PdfMakeWrapper();
    
    pdf.create().open();
  }

  
}
