import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { DataFlow } from '../models/data-flow/data-flow';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DataFlowService {
  constructor(private http: HttpClient,
    private authService: AuthService,) { }

  listaTodosDataFlows() {
    return this.http.get<DataFlow[]>(environment.apiURL + "data_flow", { observe: "response" });
  }

  /* incluirArea(area: Area) {
    return this.http.post(`${environment.apiURL}area/`, area, { observe: "response" });
  }

  pesquisaArea(id: number) {
    return this.http.get<Area>(`${environment.apiURL}area/${id}`, { observe: "response" })
  }

  alterarArea(area: Area) {
    return this.http.put<Area>(`${environment.apiURL}area/`, area, { observe: "response" });
  } */
}
