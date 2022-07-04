import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { Reunion } from 'src/app/models/reunion';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.css']
})
export class GestionEmpleadosComponent implements OnInit {

  empleados!: Array<Empleado>;

  constructor(private empleadoServ: EmpleadoService, private reunionServ: ReunionService) { 
    this.getEmpleados();
  }

  ngOnInit(): void {
  }


  getEmpleados(){
    this.empleados = new Array<Empleado>();

    this.empleadoServ.getEmpleados().subscribe((e) => {
      this.empleados = e;

      console.log(this.empleados[1].reuniones);
      for(var i=0; i < e.length; i++){
        const reus = new Array<Reunion>();
        for(var r=0; r < e[i].reuniones.length; r++){
          this.reunionServ.getReunion(e[i].reuniones[r]).subscribe((enc) => {
            var reunion = new Reunion();
            reunion  = enc;
            reus.push(reunion);
          });
        }
        this.empleados[i].reuniones = reus;
        console.log("lista reuniones de " + this.empleados[i].nombre, this.empleados[i].reuniones);
      }
    });
  }
}
