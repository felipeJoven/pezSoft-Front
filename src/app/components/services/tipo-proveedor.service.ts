import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable } from 'rxjs';
import { TipoProveedor } from '../models/tipo-proveedor';

@Injectable({
  providedIn: 'root'
})
export class TipoProveedorService {
  
  private apiUrl = 'http://localhost:8080/tipo-proveedor'

  constructor( private http: HttpClient) { }

  obtenerTipoProveedores(): Observable<TipoProveedor[]> {
    return this.http.get<TipoProveedor[]>(this.apiUrl);
  }
}