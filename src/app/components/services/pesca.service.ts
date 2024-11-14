import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Pesca } from '../models/pesca';
import { ManejoErrorService } from './shared/manejo-error.service';


@Injectable({
  providedIn: 'root'
})
export class PescaService {

  private apiUrl = 'http://localhost:8080/pesca'

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerPescas(filtro?: string): Observable<Pesca[]> {
    let params = new HttpParams;
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Pesca[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }
  
  obtenerPescaPorId(id: number): Observable<Pesca> {
    return this.http.get<Pesca>(this.apiUrl + `/${id}`);
  }

  agregarEditarPesca(postData: any, pescaSeleccionada: any): Observable<any> {    
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!pescaSeleccionada) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(this.apiUrl + `/${pescaSeleccionada}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarPesca(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}