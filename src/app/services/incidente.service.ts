import { formatDate } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Incidente } from '../models/incidente/incidente';
import { Protocolo } from '../models/protocolo/protocolo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class IncidenteService {

  apiSuffix = "incidente/";
  constructor(private http: HttpClient) { }

  pesquisaProximoProtocolo() {
    return this.http.get<Protocolo>(`${environment.apiURL}${this.apiSuffix}protocolo/1`, { observe: "response" });
  }

  incluir(registro: Incidente)
  {
    return this.http.post(`${environment.apiURL}${this.apiSuffix}`, registro, { observe: "response" });
  }

  alterar(registro: Incidente) {
    return this.http.put<Incidente>(`${environment.apiURL}${this.apiSuffix}`, registro, { observe: "response" });
  }

  pesquisar(id: number) {
    return this.http.get<Incidente>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  pesquisaIncidentes(codigoEmpresa: number, dataInicial: Date, dataFinal: Date, indStatus: number)
  {
    return this.http.get<Incidente[]>(`${environment.apiURL}${this.apiSuffix}empresa/${codigoEmpresa}/status/${indStatus}?dataInicial=${formatDate(dataInicial,'yyyy-MM-dd','en-US')}&dataFinal=${formatDate(dataFinal,'yyyy-MM-dd','en-US')}`, { observe: "response" });
  }
}
