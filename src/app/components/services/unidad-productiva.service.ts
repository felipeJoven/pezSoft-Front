import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams} from '@angular/common/http'
import { Observable, map, catchError } from 'rxjs';
import { UnidadProductiva } from '../models/unidad-productiva'
import { ManejoErrorService } from './shared/manejo-error.service';

@Injectable({
  providedIn: 'root'
})
export class UnidadProductivaService {
  private apiUrl = 'http://localhost:8080/unidad-productiva';

  constructor( 
    private http: HttpClient,
    private manejoError: ManejoErrorService
  ) { }

  obtenerUnidadesProductivas(filtro?: string): Observable<UnidadProductiva[]> {
    let params = new HttpParams
    if (filtro) {
      params = params.set('filtro', filtro);
    }
    return this.http.get<UnidadProductiva[]>(this.apiUrl, { params }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }

  obtenerUnidadProductivaPorId(id: number): Observable<UnidadProductiva> {
    return this.http.get<UnidadProductiva>(this.apiUrl + `/${id}`);
  }

  agregarEditarUnidadP(postData: any, unidadSeleccionada: any): Observable<any> {
    const headers = new HttpHeaders().set('Accept', 'text/plain');
    const options = { headers: headers, responseType: 'text' as 'json' };
    if (!unidadSeleccionada) {
      return this.http.post(this.apiUrl, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    } else {
      return this.http.put(`${this.apiUrl}/${unidadSeleccionada}`, postData, options).pipe(
        map(response => ({ message: response })),
        catchError(this.manejoError.manejarError)
      );
    }
  }

  eliminarUnidadProductiva(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { responseType: 'text' }).pipe(
      catchError(this.manejoError.manejarError)
    );
  }
}