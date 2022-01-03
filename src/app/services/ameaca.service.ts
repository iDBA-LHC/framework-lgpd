import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Ameaca } from '../models/ameaca/ameaca';

@Injectable({
  providedIn: 'root'
})
export class AmeacaService {

  constructor(private http: HttpClient) {}
  
  listaTodosAmeaca() {
    return this.http.get<Ameaca[]>(environment.apiURL + "ameaca/", { observe: "response" });
  }

  pesquisaAmeaca(id: number) {
    return this.http.get<Ameaca>(`${environment.apiURL}ameaca/${id}`,{ observe: "response" })
  }

  incluirAmeaca(ameaca: Ameaca) {
    return this.http.post(`${environment.apiURL}ameaca/`, ameaca, {observe: "response"});
  }

  alterarAmeaca(ameaca: Ameaca) {
    return this.http.put<Ameaca>(`${environment.apiURL}ameaca/`,ameaca, { observe: "response" });
  }

  excluirAmeaca(id: number)
  {
    return this.http.delete(`${environment.apiURL}ameaca/${id}`,{ observe: "response" })
  }
}
