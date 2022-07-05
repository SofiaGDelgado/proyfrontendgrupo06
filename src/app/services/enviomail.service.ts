import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EnviomailService {

  urlBase="http://localhost:4000/envio";

  constructor(private http: HttpClient) { }

  sendMail(email: string, asunto: string, m: string, img :string): Observable<any>{

    const httpOptions = {
      headers : new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    }

    let body = JSON.stringify({email : email, asunto: asunto, message: m, img: img});

    return this.http.post(this.urlBase, body, httpOptions);
  }
}
