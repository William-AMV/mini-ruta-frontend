import {Injectable, inject, WritableSignal, signal} from '@angular/core';
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Place } from '../models/place';

@Injectable({
  providedIn: 'root'
})

export class PlaceService {
  isLoadingFooter: WritableSignal<boolean> = signal(false);
  private http = inject(HttpClient)

  get(): Observable<Place[]> {
    return this.http.get<Place[]>('places');
  }

  delete(id: number): Observable<Place> {
    return this.http.delete<Place>(`places/${id}`)
  }

  update(id: string, places: Place): Observable<Place> {
    return this.http.put<Place>(`places/${id}`, places);
  }

  create(places: Place): Observable<Place> {
    return this.http.post<Place>('places', places);
  }
}