import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { AbstractIdbaRequestModel } from '../shared/models/abstract-idba-request-model';
import { ListaAplicacaoRetorno } from '../models/aplicacao/lista-aplicacao-retorno';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AplicacaoService {

  constructor(private http: HttpClient,
              private authService: AuthService,) { }

  getAplicacoes(){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaAplicacaoItem.p";
    entrada.user    = this.authService.getLoggedUserName();
    return this.http.post<ListaAplicacaoRetorno>(environment.apiURL, entrada);
  }
}
