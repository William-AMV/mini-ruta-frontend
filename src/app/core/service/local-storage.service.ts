import {Injectable, WritableSignal, computed, signal} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
  private accessTokenkey: string = 'accessTokenMR';
  private refreshTokenKey: string = 'refreshTokenMR';
  private rememberMeKey: string = 'rememberMeMR';
  private isLoginFromSalesforce: string = 'isLoginFromSalesforceQS';
  isRememberMeEnabled: WritableSignal<boolean> = signal(this.getRememberMeValue());
  private storage = computed(() => {
    this.storeRememberMeValue(this.isRememberMeEnabled());
    return this.isRememberMeEnabled() ? localStorage : sessionStorage;
  });

  public storeTokens(accessToken: string, refreshToken: string) {
    this.storage().setItem(this.accessTokenkey, accessToken);
    this.storage().setItem(this.refreshTokenKey, refreshToken);
  }

  public existTokens(): boolean {
    return Boolean(this.storage().getItem(this.refreshTokenKey) && this.storage().getItem(this.accessTokenkey));
  }

  public getAccessToken(): string {
    return this.storage().getItem(this.accessTokenkey) || '';
  }

  public getRefreshToken(): string {
    return this.storage().getItem(this.refreshTokenKey) || '';
  }

  public deleteTokens() {
    this.storage().removeItem(this.accessTokenkey);
    this.storage().removeItem(this.refreshTokenKey)
  }

  private getRememberMeValue(): boolean {
    return JSON.parse(localStorage.getItem(this.rememberMeKey) || 'true');
  }

  private storeRememberMeValue(value: boolean) {
    localStorage.setItem(this.rememberMeKey, String(value));
  }

  public setIsLoginFromSalesforce(value: boolean) {
    localStorage.setItem(this.isLoginFromSalesforce, String(value));
  }

  public getIsLoginFromSalesforce() {
    return JSON.parse(localStorage.getItem(this.isLoginFromSalesforce) || 'false');
  }

  public deleteIsLoginFromSalesforce() {
    localStorage.removeItem(this.isLoginFromSalesforce);
  }
}