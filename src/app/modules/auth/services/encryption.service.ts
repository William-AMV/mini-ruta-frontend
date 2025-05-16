import { Injectable } from '@angular/core';
import CryptoJS from 'crypto-js';
import {environment} from "../../../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class EncryptionService {
  private secretKey: string = environment.encryptionKey;

  encryptData(data: string): string{
    if(this.secretKey)
        return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    return "";
  }

  encryptSalesforceData(data: string): string{
    return data.replace(/___/g, '/');
  }

  encryptQuoteRoute(data: string): string {
    return data.replace(/\//g, '___');
  }

  decryptData(data: string): string{
    if(data && this.secretKey){
        const bytes = CryptoJS.AES.decrypt(data, this.secretKey);
        return bytes.toString(CryptoJS.enc.Utf8);
    }
    return "";
  }

  encryptDataObject(data: any): string{
    if(this.secretKey){
      data = JSON.stringify(data);
      return CryptoJS.AES.encrypt(data, this.secretKey).toString();
    }
    return "";
  }

  decryptDataObject(encryptedData: string): any {
    if (this.secretKey && encryptedData) {
      const bytes = CryptoJS.AES.decrypt(encryptedData, this.secretKey);
      const decryptedData = bytes.toString(CryptoJS.enc.Utf8);
      return JSON.parse(decryptedData);
    }
    return null;
  }
}