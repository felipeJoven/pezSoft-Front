import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Pesca } from '../models/pesca';


@Injectable({
  providedIn: 'root'
})
export class PescaService {

  private apiUrl = 'http://localhost:8080/pesca'

  constructor( private http: HttpClient) { }

  obtenerPesca(): Observable<Pesca[]>{
    return this.http.get<Pesca[]>(this.apiUrl);
  }
  
  obtenerPescaPorId(id: number): Observable<Pesca>{
    return this.http.get<Pesca>(this.apiUrl + `/${id}`);
  }

  addEditPesca(postData: any, selectL: any){
    
    if(!selectL){
      return this.http.post(this.apiUrl, postData);
    }else {
      return this.http.put(this.apiUrl + `/${selectL}`, postData);
    }
  }

  eliminarPesca(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
