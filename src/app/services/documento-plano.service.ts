import { PlanoMitigacao } from 'src/app/models/plano-mitigacao/plano-mitigacao';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { DocumentoPlano } from '../models/documento-plano/documento-plano';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})

export class DocumentoPlanoService {

  apiSuffix = "plano_mitigacao/";
  constructor(private http: HttpClient,
    private authService: AuthService) { }

  listaTodosDocumentoPlano(codPlanoMitigacao: number) {
    return this.http.get<DocumentoPlano []>(`${environment.apiURL}${this.apiSuffix}${codPlanoMitigacao}/documento_plano`, { observe: "response" });
  }

  incluirDocumentoPlano(documentoPlano: DocumentoPlano) {
    return this.http.post(`${environment.apiURL}${this.apiSuffix}`, documentoPlano, { observe: "response" });
  }

  pesquisaDocumentoPlano(id: number) {
    return this.http.get<DocumentoPlano>(`${environment.apiURL}${this.apiSuffix}${id}`, { observe: "response" });
  }

  alterarDocumentoPlano(documentoPlano: DocumentoPlano) {
    return this.http.put<DocumentoPlano>(`${environment.apiURL}${this.apiSuffix}`, documentoPlano, { observe: "response" });
  }
}
