import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { LocalArmazenamento } from '../models/local-armazenamento/local-armazenamento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class LocalArmazenamentoService {

  apiSuffix = "local_armazenamento/";
  constructor(private http: HttpClient,
    private authService: AuthService) { }

  listaTodosLocaisArmazenamento() {
    return this.http.get<LocalArmazenamento []>(`${environment.apiURL}${this.apiSuffix}`, { observe: "response" });
  }

  incluirLocalArmazenamento(localArmazenamento: LocalArmazenamento) {
    return this.http.post(`${environment.apiURL}${this.apiSuffix}`, localArmazenamento, { observe: "response" });
  }

  pesquisaLocalArmazenamento(id: number) {
    return this.http.get<LocalArmazenamento>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  alterarLocalArmazenamento(localArmazenamento: LocalArmazenamento) {
    return this.http.put<LocalArmazenamento>(`${environment.apiURL}${this.apiSuffix}`, localArmazenamento, { observe: "response" });
  }

  excluirLocalArmzenamento(id: number)
  {
    return this.http.delete(`${environment.apiURL}${this.apiSuffix}${id}`,{ observe: "response" })
  }
}
