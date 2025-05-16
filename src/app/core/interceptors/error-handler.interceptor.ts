import {HttpErrorResponse, HttpInterceptorFn} from '@angular/common/http';
import {catchError, throwError} from "rxjs";
import { inject } from '@angular/core';
import {ToastService} from '../service/toast.service';

export const errorHandlerInterceptor: HttpInterceptorFn = (req, next) => {
  const toastService = inject(ToastService);
  return next(req).pipe(catchError((error: HttpErrorResponse) => {
    let errorMessage = "";

    if (error.error instanceof ErrorEvent) {
        errorMessage = `Error: ${error.error.message}`;
      } else {
        if (Array.isArray(error.error)) {
          errorMessage = error.error.map((err: any) => err.message).join(' ');
        } else if (typeof error.error === 'object' && error.error.message) {
          errorMessage = error.error.message;
        } else {
          errorMessage = `Error code: ${error.status}, message: ${error.message}`;
        }
      }

      if (error.status !== 422) {
        console.error({ severity: 'error', detail: errorMessage, sticky: true });
      }

      return throwError({
        status: error.status,
        message: errorMessage,
        error: error.error
      });
  }));
};