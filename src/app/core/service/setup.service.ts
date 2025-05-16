import { Injectable, WritableSignal, signal, inject } from '@angular/core';
import { Observable, finalize, of } from 'rxjs';
import {AuthStatus} from "../../modules/auth/enums/auth-status";
import {AuthService} from "../../modules/auth/services/auth.service";

@Injectable({
  providedIn: 'root'
})
export class SetupService {

  private authService = inject(AuthService);

  isLoading: WritableSignal<boolean> = signal(true);

  load(): Observable<boolean>{
    return (
        this.authService.status() === AuthStatus.Authenticated
        ? of(true)
        : this.authService.loadAuthUser()
      ).pipe(
      finalize(() => this.isLoading.set(false))
    );
  }
}
