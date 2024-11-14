import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { Lote } from '../models/lote';
import { ManejoErrorService } from './shared/manejo-error.service';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://localhost:8080/lote'

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerLotes(filtro?: string): Observable<Lote[]>{
    let params = new HttpParams;
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Lote[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }

  obtenerLotePorId(id: number): Observable<Lote> {
    return this.http.get<Lote>(this.apiUrl + `/${id}`);
  }

  agregarEditarLote(postData: any, loteSeleccionado: any): Observable<any> {    
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!loteSeleccionado) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(this.apiUrl + `/${loteSeleccionado}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarLote(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }
}