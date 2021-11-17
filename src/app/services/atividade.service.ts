import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Atividade } from '../models/atividade/atividade';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AtividadeService {

  private apiSufix: string = "atividade/";

  constructor(private http: HttpClient, 
    private authService: AuthService) { }

  public listaAtivadadesPorProcesso(processoId: number) {
    return this.http.get<Atividade []>(`${environment.apiURL}${this.apiSufix}processo/${processoId}`, { observe: "response" });
  }

  public incluirAtividade(atividade: Atividade) {
    return this.http.post(`${environment.apiURL}${this.apiSufix}`, atividade, { observe: "response" });
  }

  public pesquisaAtividade(id: number) {
    return this.http.get<Atividade>(`${environment.apiURL}${this.apiSufix}${id}`, { observe: "response" });
  }

  public alterarAtividade(atividade: Atividade) {
    return this.http.put(`${environment.apiURL}${this.apiSufix}`, atividade, { observe: "response" });
  }

  public excluirAtividade(id: number) {
    return this.http.delete(`${environment.apiURL}${this.apiSufix}${id}`, { observe: "response" });
  }
}
