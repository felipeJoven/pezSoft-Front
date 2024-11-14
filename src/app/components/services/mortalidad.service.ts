import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Mortalidad } from '../models/mortalidad';
import { ManejoErrorService } from './shared/manejo-error.service';

@Injectable({
  providedIn: 'root'
})
export class MortalidadService {

  private apiUrl = 'http://localhost:8080/mortalidad'

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerMortalidades(filtro?: string): Observable<Mortalidad[]> {
    let params = new HttpParams;
    if (filtro) {
      params = params.set('fitro', filtro);
    }
    return this.http.get<Mortalidad[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }

  obtenerMortalidadPorId(id: number): Observable<Mortalidad> {
    return this.http.get<Mortalidad>(this.apiUrl + `/${id}`);
  }

  agregarEditarMortalidad(postData: any, mortalidadSeleccionada: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!mortalidadSeleccionada) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(this.apiUrl + `/${mortalidadSeleccionada}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarMortalidad(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}
