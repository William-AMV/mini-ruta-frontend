import {Injectable, inject, WritableSignal, signal} from '@angular/core';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Observable } from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  isLoadingFooter: WritableSignal<boolean> = signal(false);
  private http = inject(HttpClient)

  get(): Observable<User[]> {
    return this.http.get<User[]>('users');
  }

  delete(id: number): Observable<User> {
    return this.http.delete<User>(`users/${id}`)
  }

  update(id: string, user: User): Observable<User> {
    return this.http.put<User>(`users/${id}`, user);
  }

  create(user: User): Observable<User> {
    return this.http.post<User>('users', user);
  }
}