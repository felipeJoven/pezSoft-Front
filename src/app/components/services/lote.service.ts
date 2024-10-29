import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

import { Lote } from '../models/lote';

@Injectable({
  providedIn: 'root'
})
export class LoteService {
  private apiUrl = 'http://localhost:8080/lote'

  constructor( private http: HttpClient) { }

  obtenerLotes(filtro?: string): Observable<Lote[]>{
    let params = new HttpParams;
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Lote[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerLotePorId(id: number): Observable<Lote> {
    return this.http.get<Lote>(this.apiUrl + `/${id}`);
  }

  agregarEditarLote(postData: any, selectLote: any): Observable<any> {    
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if(!selectLote){
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejarError)
      );
    }else {
      return this.http.put(this.apiUrl + `/${selectLote}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejarError)
      );
    }
  }

  eliminarLote(id:number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.manejarError)
    );
  }

  private manejarError(error: HttpErrorResponse) {
    let errorMessage = 'Ocurrió un error desconocido';
    if (error.error instanceof ErrorEvent) {
      // Error del lado del cliente
      errorMessage = `Error: ${error.error.message}`;
    } else if (typeof error.error === 'string') {
      // El backend devolvió un error como texto
      errorMessage = `Error: ${error.error}`;
    } else {
      // El backend devolvió un código de error
      errorMessage = `Código de error: ${error.status}, mensaje: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }
}
