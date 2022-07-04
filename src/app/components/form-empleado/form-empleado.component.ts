import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Dependencia } from 'src/app/models/dependencia';
import { Empleado } from 'src/app/models/empleado';
import { DependenciaService } from 'src/app/services/dependencia.service';
import { EmpleadoService } from 'src/app/services/empleado.service';

@Component({
  selector: 'app-form-empleado',
  templateUrl: './form-empleado.component.html',
  styleUrls: ['./form-empleado.component.css']
})
export class FormEmpleadoComponent implements OnInit {

  empleado!: Empleado;
  dependencias!: Array<Dependencia>;

  constructor(private empleadoServ: EmpleadoService, private dependenciaServ: DependenciaService) { 
    this.getDependencias();
    this.empleado = new Empleado();
  }

  ngOnInit(): void {
  }

  getDependencias(){
    this.dependencias = new Array<Dependencia>();
    this.dependenciaServ.getDependencias().subscribe((dep) =>{
      this.dependencias = dep;
    })
  }

  altaEmpleado(){
    this.empleadoServ.altaEmpleado(this.empleado).subscribe((emp)=> {
      console.log(emp)
    });
  }

  resetForm(form: NgForm){
    form.reset();
  }
}
