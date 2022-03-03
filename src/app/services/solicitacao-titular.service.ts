import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Protocolo } from '../models/protocolo/protocolo';
import { SolicitacaoTitular } from '../models/solicitacao-titular/solicitacao-titular';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoTitularService {

  apiSuffix = "solicitacao-titular/";
  constructor(private http: HttpClient) { }

  pesquisaProximoProtocolo() {
    return this.http.get<Protocolo>(`${environment.apiURL}${this.apiSuffix}protocolo/2`, { observe: "response" });
  }

  incluir(registro: SolicitacaoTitular)
  {
    return this.http.post(`${environment.apiURL}${this.apiSuffix}`, registro, { observe: "response" });
  }

  alterar(registro: SolicitacaoTitular) {
    return this.http.put<SolicitacaoTitular>(`${environment.apiURL}${this.apiSuffix}`, registro, { observe: "response" });
  }

  pesquisar(id: number) {
    return this.http.get<SolicitacaoTitular>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  pesquisaSolicitacoes(codigoEmpresa: number, dataInicial: Date, dataFinal: Date, indStatus: number, cpfTitular: string, cpfRepresentante: string)
  {
    return this.http.get<SolicitacaoTitular[]>(`${environment.apiURL}${this.apiSuffix}empresa/${codigoEmpresa}/status/${indStatus}
      ?dataInicial=${formatDate(dataInicial,'yyyy-MM-dd','en-US')}
      &dataFinal=${formatDate(dataFinal,'yyyy-MM-dd','en-US')}
      &cpfTitular=${cpfTitular}
      &cpfRepresentante=${cpfRepresentante}`, { observe: "response" });
  }
}
