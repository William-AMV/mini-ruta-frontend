import {HttpErrorResponse, HttpInterceptorFn, HttpStatusCode} from '@angular/common/http';
import {inject} from '@angular/core';
import {LocalStorageService} from "../service/local-storage.service";
import {EncryptionService} from "../../modules/auth/services/encryption.service";
import {Router} from "@angular/router";
import {catchError, throwError} from "rxjs";
import {AuthService} from "../../modules/auth/services/auth.service";
import {AuthStatus} from "../../modules/auth/enums/auth-status";

export const apiInterceptor: HttpInterceptorFn = (req, next) => {
  const localStorageService = inject(LocalStorageService);
  const encryptionService = inject(EncryptionService);
  const authService = inject(AuthService);
  const router = inject(Router);

  if (req.body instanceof FormData){
    req = req.clone({
      setHeaders: {
        Authorization: `Bearer ${encryptionService.decryptData(localStorageService.getAccessToken())}`
      }
    });
  }
  else{
    req = req.clone({
      setHeaders: {
        Authorization : `Bearer ${encryptionService.decryptData(localStorageService.getAccessToken())}`,
        "Content-Type" : 'application/json'
      }
    });
  }
  return next(req).pipe(catchError((err: HttpErrorResponse) => {
    if (err.status === HttpStatusCode.Unauthorized) {
      localStorageService.deleteTokens()
      router.navigate(['auth/login']);

      authService.status.set(AuthStatus.Unauthenticated)
    }
    return throwError(() => err)
  }));
};