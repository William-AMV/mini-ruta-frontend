import {inject, Injectable, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, map, Observable, of} from "rxjs";
import {Credentials} from "../interfaces/credentials";
import {TokenResponse} from "../interfaces/token-response";
import {AuthUser} from "../models/auth-user";
import {AuthStatus} from "../enums/auth-status";
import {LocalStorageService} from "../../../core/service/local-storage.service";
import {VerifyResponse} from "../interfaces/verify-response";
import {EncryptionService} from "./encryption.service";
import {RoleEnum} from "../../../core/enums/role-enum";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private http = inject(HttpClient);
  private localStorageService = inject(LocalStorageService);
  private encryptionService = inject(EncryptionService);

  user: WritableSignal<AuthUser> = signal(new AuthUser());
  status: WritableSignal<AuthStatus> = signal(AuthStatus.Unauthenticated);

  verifyEmail(email: string): Observable<VerifyResponse> {
    return this.http.post<VerifyResponse>('auth/verifyEmail', {email});
  }

  login(credentials: Credentials): Observable<TokenResponse> {
    return this.http.post<TokenResponse>('login', credentials).pipe(
      map(resp => this.setAuthData(resp)),
    )
  }

  logout(): Observable<void> {
    return this.http.post<TokenResponse>('auth/logout', null).pipe(
      map(() => this.resetAuthData())
    );
  }

  private authUser(): Observable<AuthUser> {
    return this.http.get<AuthUser>('authUser').pipe(
      map(resp => {
        const user = this.encryptionService.decryptDataObject(resp.response);
        return user as AuthUser
      })
    );
  }

  loadAuthUser(): Observable<boolean> {
    return this.authUser().pipe(
      map(authUser => {
        this.user.set(new AuthUser({...authUser}));
        this.status.set(AuthStatus.Authenticated);
        return true;
      }),
      catchError(() => of(true))
    );
  }

  private setAuthData(resp: TokenResponse) {
    const data = this.encryptionService.decryptDataObject(String(resp.response));
    if (data) {
      const {token, refreshToken, user} = data as TokenResponse;
      const encryptedToken = this.encryptionService.encryptData(token.token);
      this.localStorageService.storeTokens(encryptedToken, refreshToken);
      this.user.set(new AuthUser({user}));
      this.status.set(AuthStatus.Authenticated);
    }
    return data;
  }

  private resetAuthData() {
    this.localStorageService.deleteTokens();
    localStorage.setItem('auth-token-changedQS', Date.now().toString());
    this.user.set(new AuthUser());
    this.status.set(AuthStatus.Unauthenticated);
  }

  isAdministrator = (): boolean => {
    const user = this.user;
    return user && user().user && user().user.role === RoleEnum.ADMINISTRATOR;
  }
}