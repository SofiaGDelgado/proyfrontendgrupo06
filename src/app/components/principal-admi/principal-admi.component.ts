import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-principal-admi',
  templateUrl: './principal-admi.component.html',
  styleUrls: ['./principal-admi.component.css']
})
export class PrincipalAdmiComponent implements OnInit {

  constructor(private router:Router) { }

  ngOnInit(): void {
  }

  RegistroReuniones(){
    this.router.navigate(['principal/Administrador/registroReuniones']);
  }
  
  Estadistica(){
    this.router.navigate(['principal/Administrador/estadistica']);
  }
  GestionEmpleados(){
    this.router.navigate(['principal/Administrador/gestionEmpleados']);
  }



}
