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

  setUser(user: string) {
    localStorage.setItem("user", user);
  }

  getUser(): string {
    return localStorage.getItem("user")!;
  }

  clear() {
    localStorage.clear();
    this.token$.next(undefined);
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.token$.next(undefined);
    return true;
  }

}