import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map, Observable, of} from 'rxjs';
import {Workshop} from '../models/workshop.model';
import { environment } from '../../../environments/environment';


@Injectable({ providedIn: 'root' })
export class WorkshopService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.basePath}/api/admin/workshops`; // your backend API

  private workshops_mock: Workshop[] = [
    { id: 1, title: 'Angular Basics', description: 'Intro to Angular', date: new Date(), trainer: 101 },
    { id: 2, title: 'Reactive Forms', description: 'Deep dive into forms', date: new Date(), trainer: 102 },
    { id: 3, title: 'PrimeNG Components', description: 'Using tables, dialogs', date: new Date(), trainer: 103 }
  ];

formatDate(dateStr: string): string {
  const date = new Date(dateStr);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // months are 0-indexed
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

getAll(): Observable<Workshop[]> {
  return this.http.get<Workshop[]>(`${this.apiUrl}/`);
}

isEnrolled(workshopId: number): Observable<{ is_enrolled: boolean }> {
  return this.http.get<{ isEnrolled: boolean }>(
    `${environment.basePath}/api/workshops/${workshopId}/is-enrolled/?userId=${JSON.parse(localStorage.getItem('user') || '{}').id}`
  ).pipe(
    map(res => ({ is_enrolled: res.isEnrolled }))
  );
}



  // POST create new workshop
  create(workshop: Workshop): Observable<Workshop> {
    return this.http.post<Workshop>(this.apiUrl+'/', {...workshop, date: this.formatDate(workshop.date.toString())});
  }

  // PUT update existing workshop
  update(id: number, workshop: Workshop): Observable<Workshop> {
    return this.http.put<Workshop>(`${this.apiUrl}/${id}/`, {...workshop, date: this.formatDate(workshop.date.toString())});
  }

  // DELETE workshop
  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}/`);
  }
}
