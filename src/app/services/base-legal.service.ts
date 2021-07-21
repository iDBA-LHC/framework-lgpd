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
    return this.http.get<BaseLegal[]>(environment.apiURL + "base_legal/", { observe: "response" });
  }

  incluirBaseLegal(baseLegal: BaseLegal) {
    return this.http.post(`${environment.apiURL}base_legal/`, baseLegal, {observe: "response"});
  }

  pesquisaBaseLegal(id: number) {
    return this.http.get<BaseLegal>(`${environment.apiURL}base_legal/${id}`,
      { observe: "response" })
  }

  alterarBaseLegal(baseLegal: BaseLegal) {
    return this.http.put<BaseLegal>(
      `${environment.apiURL}base_legal/`,
      baseLegal, { observe: "response" })
  }
}
