import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, catchError } from 'rxjs';
import { Especie } from '../models/especie';
import { ManejoErrorService } from './shared/manejo-error.service';

@Injectable({
  providedIn: 'root'
})

export class EspecieService {
  private apiUrl = 'http://localhost:8080/especie'

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerEspecies(filtro?: string): Observable<Especie[]> {
    let params = new HttpParams
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Especie[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }

  obtenerEspeciePorId(id: number): Observable<Especie> {
    return this.http.get<Especie>(this.apiUrl + `/${id}`);
  }

  agregarEditarEspecie(postData: any, especieSeleccionada: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!especieSeleccionada) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(`${this.apiUrl}/${especieSeleccionada}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarEspecie(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }
}