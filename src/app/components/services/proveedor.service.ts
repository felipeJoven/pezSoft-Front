import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable, map, catchError } from 'rxjs';
import { Proveedor } from '../models/proveedor'
import { ManejoErrorService } from './shared/manejo-error.service';

@Injectable({
  providedIn: 'root'
})
export class ProveedorService {
  private apiUrl = 'http://localhost:8080/proveedor'

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerProveedores(filtro?: string): Observable<Proveedor[]> {
    let params = new HttpParams;
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<Proveedor[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }

  obtenerProveedorPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(this.apiUrl + `/${id}`);
  }

  agregarEditarProveedor(postData: any, proveedorSeleccionado: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!proveedorSeleccionado) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(`${this.apiUrl}/${proveedorSeleccionado}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarProveedor(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }
}