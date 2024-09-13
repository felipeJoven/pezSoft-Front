import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Especie } from '../models/especie';

@Injectable({
  providedIn: 'root'
})

export class EspecieService {
  private apiUrl = 'http://localhost:8080/especie'

  constructor( private http: HttpClient) { }


  obtenerEspecies(): Observable<Especie[]> {
    return this.http.get<Especie[]>(this.apiUrl);
  }

  obtenerEspeciePorId(id: number): Observable<Especie> {
    return this.http.get<Especie>(this.apiUrl + `/${id}`);
  }

  agregarEditarEspecie(postData: any, selectEspecie: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!selectEspecie) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.handleError)
      );
    } else {
      return this.http.put(`${this.apiUrl}/${selectEspecie}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.handleError)
      );
    }
  }

  eliminarEspecie(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }

  private handleError(error: HttpErrorResponse) {
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
