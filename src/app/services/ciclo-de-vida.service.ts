import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { CicloDeVida } from '../models/ciclo-de-vida/ciclo-de-vida';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CicloDeVidaService {
  constructor(private http: HttpClient,
              private authService: AuthService, ) {}
            
  listaTodasAreas()
  {
    // return this.http.get<CicloDeVida[]>(environment.apiURL + "base-legal", { observe: "response" });
  }
}
