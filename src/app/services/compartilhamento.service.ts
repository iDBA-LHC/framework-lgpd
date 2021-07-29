import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Compartilhamento } from '../models/compartilhamento/compartilhamento';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class CompartilhamentoService {

  apiSuffix: string = "compartilhamento/";

  constructor(private http: HttpClient,
    private authService: AuthService) { }

  listarTodosCompartilhamentos() {
    return this.http.get<Compartilhamento []>(`${environment.apiURL}${this.apiSuffix}`, { observe: "response" });
  }

  incluirCompartilhamento(compartilhamento: Compartilhamento) {
    return this.http.post(`${environment.apiURL}${this.apiSuffix}`, compartilhamento, { observe: "response" });
  }

  pesquisaCompartilhamento(id: number) {
    return this.http.get<Compartilhamento>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  alterarCompartilhamento(compartilhamento: Compartilhamento) {
    return this.http.put<Compartilhamento>(`${environment.apiURL}${this.apiSuffix}`, compartilhamento, { observe: "response" });
  }
}
