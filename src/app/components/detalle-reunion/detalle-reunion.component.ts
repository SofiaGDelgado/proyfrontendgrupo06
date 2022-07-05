import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Reunion } from 'src/app/models/reunion';
import { ReunionService } from 'src/app/services/reunion.service';

@Component({
  selector: 'app-detalle-reunion',
  templateUrl: './detalle-reunion.component.html',
  styleUrls: ['./detalle-reunion.component.css']
})
export class DetalleReunionComponent implements OnInit {

  action!: boolean;
  reunion!: Reunion;
  constructor(private router: Router ,private rout: ActivatedRoute, private reunionService: ReunionService) { 
    this.reunion = new Reunion();
    this.recibirDato();
  }

  ngOnInit(): void {
  }

  recibirDato(){
    this.rout.params.subscribe((params) => {
      if (params['id']) {
        if (params['id'] === '') {
          this.action = false;
        }
        else {
          this.action = true;
          this.obtenerReunion(params['id']);
        }
      }
    });
}

obtenerReunion(id: string){
  this.reunionService.getReunion(id).subscribe((r)=> {
    this.reunion = r;
  })
}



}
