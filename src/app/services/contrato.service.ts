import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Contrato } from '../models/contrato/contrato';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class ContratoService {

  private apiSufix: string = "contrato/";

  constructor(private http: HttpClient, 
    private authService: AuthService) { }

  public listaContratosPorProcesso(processoId: number) {
    return this.http.get<Contrato []>(`${environment.apiURL}${this.apiSufix}processo/${processoId}`, { observe: "response" });
  }

  public incluirContrato(contrato: Contrato) {
    return this.http.post(`${environment.apiURL}${this.apiSufix}`, contrato, { observe: "response" });
  }

  public pesquisaContrato(id: number) {
    return this.http.get(`${environment.apiURL}${this.apiSufix}${id}`, { observe: "response" });
  }
  
  public alterarContrato(contrato: Contrato) {
    return this.http.put(`${environment.apiURL}${this.apiSufix}`, contrato, { observe: "response" });
  }
}
