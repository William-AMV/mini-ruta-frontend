import {CanActivateFn, Router} from '@angular/router';
import {inject} from "@angular/core";
import {AuthService} from "../../modules/auth/services/auth.service";

export const administratorGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if(authService.isAdministrator())
    return true;
  else
  {
    router.navigateByUrl('/error_permissions')
    return false;
  }
};
