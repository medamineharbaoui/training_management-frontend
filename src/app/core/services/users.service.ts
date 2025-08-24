import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {User} from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root' // available globally
})
export class UsersService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.basePath}/api/admin/users`; // change to your backend URL

  private users_mock: User[] = [
    { username: 'admin1', email: 'admin1@test.com', password: '123', role: 'admin' },
    { username: 'trainer1', email: 'trainer1@test.com', password: '123', role: 'trainer' },
    { username: 'participant1', email: 'participant1@test.com', password: '123', role: 'participant' }
  ];

  // GET all users
  getAll(): Observable<User[]> {
    //return of(this.users_mock);
    //TO-DO
    return this.http.get<User[]>(this.apiUrl +"/");
  }

  // GET single user by username
  getByUsername(username: string): Observable<User> {
    return this.http.get<User>(`${environment.basePath}/api/user/${username}/`);
  }



    updateUserRole(user: User): Observable<User> {
    return this.http.put<User>(`${environment.basePath}/api/update/${user.id}/`, {
      role : user.role,
    });
  }

}
