import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import {SetupService} from "../service/setup.service"

export const setupGuard: CanActivateFn = (route, state) => {
  const setupService = inject(SetupService);

  return setupService.load();
};