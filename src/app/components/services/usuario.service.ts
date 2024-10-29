import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { catchError, map, Observable, throwError } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/usuario'

  constructor(
    private http: HttpClient
  ) { }

  obtenerUsuarios(filtro?: string): Observable<Usuario[]> {
    let params = new HttpParams
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Usuario[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejarError)
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl + `/${id}`);
  }

  agregarEditarUsuario(postData: any, selectUsuario: any): Observable<any> {
    const headers = new HttpHeaders().set('Acept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!selectUsuario) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejarError)
      );
    } else {
      return this.http.put(this.apiUrl + `/${selectUsuario}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejarError)
      );
    }
  }

  eliminarUsuario(id: number): Observable<any> {
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