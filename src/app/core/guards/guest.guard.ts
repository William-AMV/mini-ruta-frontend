import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map } from 'rxjs';
import {AuthService} from "../../modules/auth/services/auth.service";
import {LocalStorageService} from "../service/local-storage.service";
import {SetupService} from "../service/setup.service";
import {AuthStatus} from "../../modules/auth/enums/auth-status";

export const guestGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const localStorageService = inject(LocalStorageService);
  const setupService = inject(SetupService);

  if (authService.status() === AuthStatus.Authenticated) {
    router.navigate(['']);
    return false;
  }

  if (localStorageService.existTokens()) {
    return authService.loadAuthUser().pipe(map(() => {
      if (authService.status() === AuthStatus.Authenticated) {
        router.navigate(['']);
        return false;
      }
      if (setupService.isLoading()) setupService.isLoading.set(false);
      return true;
    }));
  }
  if (setupService.isLoading()) setupService.isLoading.set(false);
  return true;
};