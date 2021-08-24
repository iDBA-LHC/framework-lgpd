import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { CicloMonitoramento } from '../models/ciclo-monitoramento/ciclo-monitoramento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CicloMonitoramentoService {

  apiSuffix = "ciclo_monitoramento/";

  constructor(private http: HttpClient,
    private authService: AuthService, ) { }

  listaTodosCicloMonitoramentos() {
    return this.http.get<CicloMonitoramento[]>(`${environment.apiURL}${this.apiSuffix}`, { observe: "response" });
  }

  pesquisaCicloMonitoramento(id: number) {
    return this.http.get<CicloMonitoramento>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  incluirCicloMonitoramento(ciclo: CicloMonitoramento) {
    return this.http.post<CicloMonitoramento>(`${environment.apiURL}${this.apiSuffix}`, ciclo, { observe: "response" });
  }

  alterarCicloMonitoramento(ciclo: CicloMonitoramento) {
    return this.http.put(`${environment.apiURL}${this.apiSuffix}`, ciclo, { observe: "response" });
  }
}
