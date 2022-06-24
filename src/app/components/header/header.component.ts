import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {

  constructor(private router: Router, public loginService: LoginService) { }

  ngOnInit(): void {

  }
  Sesion():void{
    this.router.navigate(['login']);
  }
  logout(){
    this.loginService.logout();
  }
}
