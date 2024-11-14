import { Injectable } from '@angular/core';
import { HttpClient} from '@angular/common/http'
import { Observable} from 'rxjs';
import { Rol } from '../models/rol';

@Injectable({
  providedIn: 'root'
})
export class RolService {
  private apiUrl= 'http://localhost:8080/rol'

  constructor(
    private http: HttpClient
  ) { }

  obtenerRoles(): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl);
  }
  
  obtenerRolesPorId(id: number): Observable<Rol[]> {
    return this.http.get<Rol[]>(this.apiUrl + `${id}`);
  }
}