import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable, catchError, map, throwError } from 'rxjs';
import { Proveedor } from '../models/proveedor'

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:8080/proveedor'

  constructor( private http: HttpClient) { }


  obtenerProveedores(filtro?: string): Observable<Proveedor[]> {
    let params = new HttpParams
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Proveedor[]>(this.apiUrl, { params }).pipe(
      catchError(this.handleError)
    );
  }

  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(this.apiUrl + `/${id}`);
  }

  agregarEditarProveedor(postData: any, selectProveedor: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!selectProveedor) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.handleError)
      );
    } else {
      return this.http.put(`${this.apiUrl}/${selectProveedor}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.handleError)
      );
    }
  }

  eliminarProveedor(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.handleError)
    );
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
