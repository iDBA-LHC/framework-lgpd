import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { BaseLegal } from '../models/base-legal/base-legal';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BaseLegalService {
  constructor(private http: HttpClient,
              private authService: AuthService, ) {}
            
  listaTodasBasesLegais()
  {
      return [
          new BaseLegal(),
          new BaseLegal()
      ];
    // return this.http.get<BaseLegal[]>(environment.apiURL + "base-legal", { observe: "response" });
  }
}
