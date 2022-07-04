import { Component, OnInit } from '@angular/core';
import { Empleado } from 'src/app/models/empleado';
import { EmpleadoService } from 'src/app/services/empleado.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-gestion-empleados',
  templateUrl: './gestion-empleados.component.html',
  styleUrls: ['./gestion-empleados.component.css']
})
export class GestionEmpleadosComponent implements OnInit {

  empleados!: Array<Empleado>;
  empleado!: Empleado;

  constructor(private empleadoServ: EmpleadoService,private router: Router, private toastr: ToastrService) { 
    
  }

  ngOnInit(): void {
    this.getEmpleados();
  }


  getEmpleados(){
    this.empleados = new Array<Empleado>();

    this.empleadoServ.getEmpleados().subscribe((e) => {
      this.empleados = e;
    })
  }
  
  altaEmpleado(){
    this.router.navigate(['principal/Administrador/gestionEmpleados/formEmpleado', 0]);
  }

  borrarEmpleado(empleado: Empleado){
    this.empleadoServ.deleteEmpleado(empleado._id).subscribe(
      result=>{
        
        if(result.status=="1"){
          this.toastr.success(result.msg,'Operacion exitosa',{
            extendedTimeOut:3000
          });
          this.getEmpleados();
        }
       
      },
      error=>{
        if(error.status=="0"){
          this.toastr.error(error.msg);
        }
        
      }
     );
  }

  modificarEmpleado(empleado: Empleado){
    this.router.navigate(['principal/Administrador/gestionEmpleados/formEmpleado', empleado._id]);
  }
}
