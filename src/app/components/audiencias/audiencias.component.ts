import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Oficina } from 'src/app/models/oficina';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-audiencias',
  templateUrl: './audiencias.component.html',
  styleUrls: ['./audiencias.component.css']
})
export class AudienciasComponent implements OnInit {

  reuniones!: Array <Reunion>;
  oficinaSelected!: string;
  oficinas!:Array <Oficina>;
  constructor(private reunionService: ReunionService, private router: Router, private toastr: ToastrService) { }

  ngOnInit(): void {
    this.cargarReuniones();
    this.getOficinas();
  }
  busquedaPorOficina(){
    this.reunionService.getReunionesOficina(this.oficinaSelected).subscribe(
      (result)=>{
        this.reuniones = result;
        console.log();
      }
    )
  }
  getOficinas(){
    this.oficinas = new Array<Oficina>();
    this.reunionService.getOficinas().subscribe((o) => {
      this.oficinas = o;
    })
  }
  cargarReuniones(){
    this.reunionService.getReuniones().subscribe(
      result=>{
        console.log(result);
        var reunion= new Reunion();
        this.reuniones=new Array <Reunion>();
        result.forEach((element:any) => {
          Object.assign(reunion, element);
          console.log(reunion);
          this.reuniones.push(reunion);
          reunion= new Reunion();
        });
        console.log(this.reuniones);
        // this.dtTrigger.next();
      },
      error=>{
      }
    );
  }

  verDetalle(r: Reunion){
    this.router.navigate(['detalle/reunion', r._id]);
  }
}
