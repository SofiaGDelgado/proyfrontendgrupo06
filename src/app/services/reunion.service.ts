import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReunionService {

  constructor(private http: HttpClient) { }

  urlBase="http://localhost:4000/api/reunion/";

  getTiposReunion(): Observable<any>{

    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get(this.urlBase,httpOption);
  }
  getReuniones(): Observable<any>{

    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }

    return this.http.get(this.urlBase,httpOption);
  }

  getReunionesOficina(id:string): Observable<any>{

    const httpOption = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      params: new HttpParams({

      })
      .append("id", id)
    }

    return this.http.get(this.urlBase+id,httpOption);
  }
  
  
}
