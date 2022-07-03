import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.css']
})
export class GestionEmpleadosComponent implements OnInit {

  empleados!: Array<Empleado>;

  constructor(private empleadoServ: EmpleadoService) { 
    this.getEmpleados();
  }

  ngOnInit(): void {
  }


  getEmpleados(){
    this.empleados = new Array<Empleado>();

    this.empleadoServ.getEmpleados().subscribe((e) => {
      this.empleados = e;
    })
  }
}
