import { Injectable } from '@angular/core';
import { HttpErrorResponse,HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class ValidationService {

  constructor(private http: HttpClient) { }

  handle422Error(err: HttpErrorResponse): Observable<any> {
    if (err.status === 422 && err.error.errors) {
      const errorMessages = err.error.errors.map((error: any) => error.message);
      return throwError({ status: 422, messages: errorMessages });
    } else {
      return throwError({ status: err.status, messages: ['Unknown error occurred'] });
    }
  }

}