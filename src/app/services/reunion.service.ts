import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Reunion } from '../models/reunion';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  constructor(private http: HttpClient) { }

  urlBase = "http://localhost:4000/api/"

  getTiposReunion(): Observable<any>{

    const httpOption = {
      headers: new HttpHeaders({
        
      })
    }

    return this.http.get(this.urlBase + 'tipoReunion',httpOption);
  }

  getReuniones(): Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get(this.urlBase+ 'reunion', httpOption);
  }

  addReunion(r:Reunion): Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    let body = JSON.stringify(r);

    console.log(body);

    return this.http.post(this.urlBase + 'reunion', body, httpOption);
  }

  getOficinas(): Observable<any>{
    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get(this.urlBase + 'oficina', httpOption);
  }

  
}
