import {Injectable, inject, WritableSignal, signal} from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import { Stop } from '../models/stop';

@Injectable({
  providedIn: 'root'
})
export class StopService {
  isLoadingFooter: WritableSignal<boolean> = signal(false);
  private http = inject(HttpClient)

  get(): Observable<Stop[]> {
    return this.http.get<Stop[]>('stops');
  }

  delete(id: number): Observable<Stop> {
    return this.http.delete<Stop>(`stops/${id}`)
  }

  update(id: string, stop: Stop): Observable<Stop> {
    return this.http.put<Stop>(`stops/${id}`, stop);
  }

  create(stop: Stop): Observable<Stop> {
    return this.http.post<Stop>('stops', stop);
  }
}