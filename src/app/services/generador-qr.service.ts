import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneradorQrService {

  constructor(private http:HttpClient) { }

  public getQr(url:string):Observable<any>{
    const options = {
      method: 'GET',
      params: {
        targetForQr: url,
      },
      headers: {
        'X-RapidAPI-Key': '2ba1522730msh0d4de2f8814d6f2p1b77e8jsn4b0d284ba4a2',
        'X-RapidAPI-Host': 'qr-code-generator27.p.rapidapi.com'
      }
    };

    return this.http.get('https://qr-code-generator27.p.rapidapi.com/', options);
  }
}
