import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';
import {User} from '../models/user.model';
import { environment } from '../../../environments/environment';
import { LocalStorageService } from './local-storage.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.basePath}/api`; // your backend API

  constructor(private http: HttpClient) {}

  localStorageService = inject(LocalStorageService);

  register(user: User): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register/`, user);
  }

  login(username: string, password: string) {
    return this.http.post<{ access: string; refresh: string }>(
      `${this.apiUrl}/login/`,
      { username, password }
    ).pipe(
      tap(tokens => {
        localStorage.setItem('accessToken', tokens.access);
        localStorage.setItem('refreshToken', tokens.refresh);
      })
    );
  }

  getAccessToken() {
    return this.localStorageService.getItem('accessToken');
  }

  refreshToken(): Observable<{ access: string }> {
    const refreshToken = this.localStorageService.getItem('refreshToken');
    return this.http.post<{ access: string }>(
      `${this.apiUrl}/token/refresh`,
      { refreshToken }
    ).pipe(
      tap(res => localStorage.setItem('accessToken', res.access))
    );
  }

  logout() {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
  }
}
