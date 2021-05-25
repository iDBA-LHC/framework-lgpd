import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { PesquisaEmitenteEntrada } from '../models/emitente/pesquisa-emitente-entrada';
import { environment } from 'src/environments/environment';
import { PesquisaEmitenteRetorno } from '../models/emitente/pesquisa-emitente-retorno';
import { PesquisaTituloEntrada } from '../models/emitente/pesquisa-titulo-entrada';
import { PesquisaTituloRetorno } from '../models/emitente/pesquisa-titulo-retorno';

@Injectable({
  providedIn: 'root'
})
export class EmitenteService {

  constructor(private http: HttpClient,
              private authService: AuthService, ) {}

  buscarEmitente(codRepres : number, tipoTabelaPreco : number){
    var entrada = new PesquisaEmitenteEntrada();
    entrada.program = "pedido-web/buscaEmitente.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters["codigoRepresentante"] = codRepres;
    entrada.parameters["tipoTabelaPreco"] = tipoTabelaPreco == 2 ? 'MKT' : "";
    var pesquisaEmitenteRetorno = this.http.post<PesquisaEmitenteRetorno>(environment.apiURL, entrada);
    return pesquisaEmitenteRetorno;
  }

  buscaTitulosEmitente(codigoEmitente : number){
    var entrada = new PesquisaTituloEntrada();
    entrada.program = "pedido-web/buscaTitulosEmitente.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters = {};
    entrada.parameters["codigoEmitente"] = codigoEmitente;
    return this.http.post<PesquisaTituloRetorno>(environment.apiURL, entrada);
  }


}
