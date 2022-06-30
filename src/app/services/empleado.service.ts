import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Empleado } from '../models/empleado';

@Injectable({
  providedIn: 'root'
})
export class EmpleadoService {

  urlBase= "http://localhost:4000/api/empleados/"

  constructor(private http: HttpClient) { }

  getEmpleados():Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        
      })
    }

    return this.http.get(this.urlBase, httpOption)
  }

  altaEmpleado(empleado: Empleado):Observable<any>{

    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    let body = JSON.stringify(empleado);
    
    return this.http.post(this.urlBase, body, httpOption)
  }
}
