import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Credentials } from '../../models/auth/auth.model';
import { AppStorage } from '../../storage/app.storage';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private readonly apiUrl = "http://localhost:8080/auth"
  private isLoggedInSubject = new BehaviorSubject<boolean>(false);
  isLoggedIn$ = this.isLoggedInSubject.asObservable();

  constructor(
    private http: HttpClient, 
    private appStorage: AppStorage
  ) { this.isLoggedInSubject.next(!!this.appStorage.getToken()); }

  login(credential: Credentials) {
    return this.http.post(`${this.apiUrl}/login`, credential);
  }

  isAuthenticated(): boolean {
    return !!this.appStorage.getToken();
  }

   //Cierra sesion y eliminamos el token del localStorage
  logout(){
    return !!this.appStorage.logout();
  }
}
