import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, map, catchError } from 'rxjs';
import { Usuario } from '../models/usuario';
import { ManejoErrorService } from './shared/manejo-error.service';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/usuario'

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerUsuarios(filtro?: string): Observable<Usuario[]> {
    let params = new HttpParams
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Usuario[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl + `/${id}`);
  }

  agregarEditarUsuario(postData: any, usuarioSeleccionado: any): Observable<any> {
    const headers = new HttpHeaders().set('Acept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!usuarioSeleccionado) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(this.apiUrl + `/${usuarioSeleccionado}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarUsuario(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }
}