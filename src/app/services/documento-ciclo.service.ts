import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentoCiclo } from '../models/documento-ciclo/documento-ciclo';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class DocumentoCicloService {

  apiSuffix = "documento_ciclo/";
  constructor(private http: HttpClient,
              private authService: AuthService) { }

  listarTodosDocumentoCiclo(codCicloMonitoramento: number) {
    return this.http.get<DocumentoCiclo []>(`${environment.apiURL}ciclo_monitoramento/${codCicloMonitoramento}/documento_ciclo`, { observe: "response" });
  }

  incluirDocumentoCiclo(documentoCiclo: DocumentoCiclo) {
    return this.http.post(`${environment.apiURL}${this.apiSuffix}`, documentoCiclo, { observe: "response" });
  }

  pesquisarDocumentoCiclo(id: number) {
    return this.http.get<DocumentoCiclo>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  alterarDocumentoCiclo(documentoCiclo: DocumentoCiclo) {
    return this.http.put<DocumentoCiclo>(`${environment.apiURL}${this.apiSuffix}`, documentoCiclo, { observe: "response" });
  }

  excluirDocumentoCiclo(id: number) {
    return this.http.delete(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }
}
