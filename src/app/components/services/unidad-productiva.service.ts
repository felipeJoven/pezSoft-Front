import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable, catchError, map, throwError } from 'rxjs';
import { UnidadProductiva } from '../models/unidad-productiva'

@Injectable({
  providedIn: 'root'
})
export class UnidadProductivaService {
  private apiUrl = 'http://localhost:8080/unidad-productiva';

  constructor( private http: HttpClient) { }

  obtenerUnidadesProductivas(filtro?: string): Observable<UnidadProductiva[]> {
    let params = new HttpParams
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<UnidadProductiva[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerUnidadProductivaPorId(id: number): Observable<UnidadProductiva> {
    return this.http.get<UnidadProductiva>(this.apiUrl + `/${id}`);
  }

  agregarEditarUnidadP(postData: any, selectUnidad: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!selectUnidad) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejarError)
      );
    } else {
      return this.http.put(`${this.apiUrl}/${selectUnidad}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejarError)
      );
    }
  }

  eliminarUnidadProductiva(id: number): Observable<any> {
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
