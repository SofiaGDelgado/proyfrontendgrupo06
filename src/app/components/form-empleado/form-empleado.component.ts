import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
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
  accion: string = "new";

  constructor(private empleadoServ: EmpleadoService, private dependenciaServ: DependenciaService,  private router:Router, private activatedRoute: ActivatedRoute, private toastr: ToastrService) { 
    this.getDependencias();
    this.empleado = new Empleado();
  }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params['id'] == "0"){
        this.accion = "new";
        // this.pasaje= new Pasaje();
        // this.cargarPasajeros();
        // this.mostrarPrecio=false;
        // this.pasaje.fechaCompra= new Date().toLocaleString();
        // this.obtenerPrecios();
      }else{
        this.accion = "update";
        // this.cargarPasajeros();
        // this.cargarPasaje(params['id']);
        // this.obtenerPrecios();
      }
    });  
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
