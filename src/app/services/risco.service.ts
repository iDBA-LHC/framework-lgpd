import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Risco } from '../models/risco/risco';

@Injectable({
  providedIn: 'root'
})
export class RiscoService {

  private suffix:string = "risco/";

  constructor(private http: HttpClient) {}

  listaTodos() {
    return this.http.get<Risco[]>(`${environment.apiURL}${this.suffix}`, { observe: "response" });
  }

  pesquisa(id: number) {
    return this.http.get<Risco>(`${environment.apiURL}${this.suffix}${id}`,{ observe: "response" })
  }

  incluir(record: Risco) {
    return this.http.post(`${environment.apiURL}${this.suffix}`, record, {observe: "response"});
  }

  alterar(record: Risco) {
    return this.http.put<Risco>(`${environment.apiURL}${this.suffix}`,record, { observe: "response" });
  }

  excluir(id: number)
  {
    return this.http.delete(`${environment.apiURL}${this.suffix}${id}`,{ observe: "response" })
  }
}
