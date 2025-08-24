import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError, switchMap, catchError, of } from 'rxjs';
import { AuthService } from './auth.service';
import { LocalStorageService } from './local-storage.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private auth = inject(AuthService);
  private localStorageService = inject(LocalStorageService);

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Safe token retrieval
    const token = this.localStorageService.getItem('accessToken');
    let authReq = req;

    if (token) {
      authReq = req.clone({
        setHeaders: { Authorization: `Bearer ${token}` }
      });
    }

    return next.handle(authReq).pipe(
      catchError((err: HttpErrorResponse) => {
        // Only handle 401 if token exists
        if (err.status === 401 && token) {
          return this.handle401(req, next);
        }
        return throwError(() => err);
      })
    );
  }

  private handle401(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Refresh token safely
    return this.auth.refreshToken().pipe(
      switchMap(() => {
        const newToken = this.localStorageService.getItem('accessToken');
        const newReq = req.clone({
          setHeaders: newToken ? { Authorization: `Bearer ${newToken}` } : {}
        });
        return next.handle(newReq);
      }),
      catchError((err) => {
        // Logout on refresh failure
        this.auth.logout();
        return throwError(() => err);
      })
    );
  }
}
