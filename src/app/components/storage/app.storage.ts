import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AppStorage {
  token$ = new BehaviorSubject<string | undefined>(undefined);

  setToken(token: string) {
    this.token$.next(token);
    localStorage.setItem("token", token);
  }

  getToken(): string {
    return localStorage.getItem("token")!;
  }

  setUsuario(usuario: string) {
    localStorage.setItem("usuario", usuario);
  }

  getUsuario(): string {
    return localStorage.getItem("usuario")!;
  }

  setRol(rol: string) {
    localStorage.setItem("rol", rol);
  }

  getRol(): string {
    return localStorage.getItem("rol")!;
  }

  clear() {
    localStorage.clear();
    this.token$.next(undefined);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('usuario');
    localStorage.removeItem('rol');
    this.token$.next(undefined);
    return true;
  }

}