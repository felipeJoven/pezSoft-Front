import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { AppStorage } from "../storage/app.storage";

@Injectable({
    providedIn: 'root'
})

export class Interceptor implements HttpInterceptor {

    constructor(private appStorage: AppStorage) {}    
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const token = this.appStorage.getToken();
        if(token) {
            const httpReq = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${token}`
                }
            });
            return next.handle(httpReq);
        }
        return next.handle(req);
    }
}