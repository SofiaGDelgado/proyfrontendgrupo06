import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { parse } from 'date-fns';
import { Empleado } from 'src/app/models/empleado';
import { Notificacion } from 'src/app/models/notificacion';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { LoginService } from 'src/app/services/login.service';
import { NotificacionService } from 'src/app/services/notificacion.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  empleadoSesion!: Empleado; 
  notificacionesActivas!: Array<Notificacion>;

  constructor(private router: Router, public loginService: LoginService, private empService: EmpleadoService) {
    this.empleadoSesion = new Empleado();
    this.empleadoEnSesion();
    
  }

  ngOnInit(): void {}

  Sesion():void{
    this.router.navigate(['login']);
  }

  logout(){
    this.loginService.logout();
    this.empleadoSesion = new Empleado();
    this.notificacionesActivas = new Array<Notificacion>();
  }

  empleadoEnSesion(){
    this.empService.getEmpleados().subscribe((e) => {
      for(var i=0; i < e.length; i++){
        if(e[i].username === this.loginService.userLogged()){
          Object.assign(this.empleadoSesion, e[i]);
        }
      }
      console.log("en sesion: ", this.empleadoSesion);

      this.cargarNotificacionesRecientes();
    });

    console.log(this.empleadoSesion.notificaciones);
  }
  
  cargarNotificacionesRecientes(){
    this.notificacionesActivas = new Array<Notificacion>();
    console.log(this.empleadoSesion.notificaciones);
    for(var i=0; i < this.empleadoSesion.notificaciones.length; i++){
      
      var fechaNotificacion = this.empleadoSesion.notificaciones[i].fecha.split("-");


      var fechaV = this.empleadoSesion.notificaciones[i].fechaVencimiento.split("-");
      var fechaCompar = new Date(parseInt(fechaNotificacion[0]), parseInt(fechaNotificacion[1]), parseInt(fechaNotificacion[2]));
      var fechaComparV = new Date(parseInt(fechaV[0]), parseInt(fechaV[1]), parseInt(fechaV[2]));
      console.log(fechaCompar);
      var hoy = new Date;
      console.log(hoy);
      if(fechaCompar.getMonth() === hoy.getMonth() && fechaCompar.getFullYear() === hoy.getFullYear()){
          this.notificacionesActivas.push(this.empleadoSesion.notificaciones[i]);
      }
      else{
        if(fechaComparV > hoy){
          this.notificacionesActivas.push(this.empleadoSesion.notificaciones[i]);
        }
      }
      
      console.log(this.notificacionesActivas);
    }
  }


}
