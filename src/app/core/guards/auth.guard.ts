import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../modules/auth/services/auth.service";
import {AuthStatus} from "../../modules/auth/enums/auth-status";

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.status() === AuthStatus.Authenticated) return true
  router.navigate(['auth/login']);
  return false;
};