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
            
  listaTodosCiclosDeVida() {
    return this.http.get<CicloDeVida[]>(environment.apiURL + "ciclo_vida/", { observe: "response" });
  }

  pesquisaCicloDeVida(id: number) {
    return this.http.get<CicloDeVida>(`${environment.apiURL}ciclo_vida/${id}`,
      { observe: "response" })
  }

  incluirCicloDeVida(cicloDeVida: CicloDeVida) {
    return this.http.post(`${environment.apiURL}ciclo_vida/`, cicloDeVida, {observe: "response"});
  }

  alterarCicloDeVida(cicloDeVida: CicloDeVida) {
    return this.http.put<CicloDeVida>(
      `${environment.apiURL}ciclo_vida/`,
      cicloDeVida, { observe: "response" });
  }

  excluirCicloDeVida(id: number)
  {
    return this.http.delete(`${environment.apiURL}ciclo_vida/${id}`,{ observe: "response" })
  }
}
