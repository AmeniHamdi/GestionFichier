import { Injectable } from '@angular/core';
import { HttpInterceptor, HttpEvent, HttpRequest, HttpHandler } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class HeaderInterceptor implements HttpInterceptor {
  intercept(httpRequest: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = sessionStorage.getItem("token");
    if (!token) return next.handle(httpRequest);

    const authorization = `Bearer ${token}`;

    return next.handle(httpRequest.clone({ setHeaders: {Authorization: authorization } }));
  }
}