import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { TipoIdentificacion } from '../models/tipo-identificacion';

@Injectable({
  providedIn: 'root'
})
export class TipoIdentificacionService {  
  
  private apiUrl = 'http://localhost:8080/tipo-identificacion'
  
  constructor( private http: HttpClient) { }

  obtenerTipoIdentificaciones(): Observable<TipoIdentificacion[]> {
    return this.http.get<TipoIdentificacion[]>(this.apiUrl);
  }
}