import { Component, OnInit } from '@angular/core';
import { Reunion } from 'src/app/models/reunion';
import { TipoReunion } from 'src/app/models/tipo-reunion';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-registro-reuniones',
  templateUrl: './registro-reuniones.component.html',
  styleUrls: ['./registro-reuniones.component.css']
})
export class RegistroReunionesComponent implements OnInit {

  reunion!: Reunion;
  tiposReunion!: Array<TipoReunion>;

  constructor(private reunionService: ReunionService) { 
    this.reunion = new Reunion();
  }

  ngOnInit(): void {
  }

  registrarReunion(){

  }

  getTipoReunion(){
    this.tiposReunion = new Array<TipoReunion>();
    this.reunionService.getTiposReunion().subscribe((tR)=> {
      this.tiposReunion = tR;
    })
  }
}
