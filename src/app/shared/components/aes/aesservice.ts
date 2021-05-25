import { Injectable } from '@angular/core';
import * as CryptoJS from 'crypto-js';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})

export class AESService {

  constructor() { }

  public encrypt(value : string) : string{
    return CryptoJS.AES.encrypt(value, environment.encryptionKey.trim()).toString();
  }

  public decrypt(textToDecrypt : string){
    return CryptoJS.AES.decrypt(textToDecrypt, environment.encryptionKey.trim()).toString(CryptoJS.enc.Utf8);
  }
}
