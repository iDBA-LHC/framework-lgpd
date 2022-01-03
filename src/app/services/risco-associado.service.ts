import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RiscoAssociado } from '../models/risco-associado/risco-associado';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class RiscoAssociadoService {

  private suffix:string = "risco_associado/";

  constructor(private http: HttpClient) {}

  listaTodosRiscoAssociado() {
    return this.http.get<RiscoAssociado[]>(`${environment.apiURL}${this.suffix}`, { observe: "response" });
  }

  pesquisaRiscoAssociado(id: number) {
    return this.http.get<RiscoAssociado>(`${environment.apiURL}${this.suffix}${id}`,{ observe: "response" })
  }

  incluirRiscoAssociado(riscoAssociado: RiscoAssociado) {
    return this.http.post(`${environment.apiURL}${this.suffix}`, riscoAssociado, {observe: "response"});
  }

  alterarRiscoAssociado(riscoAssociado: RiscoAssociado) {
    return this.http.put<RiscoAssociado>(`${environment.apiURL}${this.suffix}`,riscoAssociado, { observe: "response" });
  }

  excluirRiscoAssociado(id: number)
  {
    return this.http.delete(`${environment.apiURL}${this.suffix}${id}`,{ observe: "response" })
  }
}
