import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Protocolo } from '../models/protocolo/protocolo';

@Injectable({
  providedIn: 'root'
})
export class SolicitacaoTitularService {

  apiSuffix = "solicitacao-titular/";
  constructor(private http: HttpClient) { }

  pesquisaProximoProtocolo() {
    return this.http.get<Protocolo>(`${environment.apiURL}${this.apiSuffix}protocolo/2`, { observe: "response" });
  }
}
