import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Processo } from '../models/processo/processo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ProcessoService {

  private apiSufix: string = "processo/";

  constructor(private http: HttpClient, 
    private authService: AuthService) {
      
  }

  listarProcessosPorArea(idArea: number) {
    return this.http.get<Processo []>(`${environment.apiURL}${this.apiSufix}area/${idArea}`, { observe: "response" });
  }

  incluirProcesso(processo: Processo) {
    return this.http.post(`${environment.apiURL}${this.apiSufix}`, processo, { observe: "response" });
  }

  pesquisaProcesso(id: number) {
    return this.http.get<Processo>(`${environment.apiURL}${this.apiSufix}${id}`, { observe: "response" });
  }

  alterarProcesso(processo: Processo) {
    return this.http.put(`${environment.apiURL}${this.apiSufix}`, processo, { observe: "response" });
  }

  excluirProcesso(id: number) {
    return this.http.delete(`${environment.apiURL}${this.apiSufix}${id}`, { observe: "response" });
  }

}
