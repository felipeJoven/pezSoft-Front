import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Usuario } from '../models/usuario';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  private apiUrl = 'http://localhost:8080/auth'
  
  constructor(
    private http: HttpClient
  ) { }

  obtenerUsuarios():Observable<Usuario[]>{
    return this.http.get<Usuario[]>(this.apiUrl);
  }

  obtenerUsuarioPorId(id: number): Observable<Usuario> {
    return this.http.get<Usuario>(this.apiUrl + `/${id}`);
  }

  agregarEditarUsuario(postData: any, selectUsuario: any){
    if(!selectUsuario){
      return this.http.post(this.apiUrl, postData);
    }else{
      return this.http.put(this.apiUrl + `/${selectUsuario}`, postData);
    }
  }

  eliminarUsuario(id: number): Observable<any>{
    return this.http.delete(`${this.apiUrl}/${id}`);
  }
}