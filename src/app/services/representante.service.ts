import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';
import { ListaRepresentanteEntrada } from '../models/representante/lista-representante-entrada';
import { environment } from 'src/environments/environment';
import { ListaRepresentanteRetorno } from '../models/representante/lista-representante-retorno';

@Injectable({
  providedIn: 'root'
})
export class RepresentanteService {

  constructor(private http: HttpClient,
              private authService: AuthService, ) {}

  retornaTodosRepresentantes(){
    var listaRepresentanteEntrada = new ListaRepresentanteEntrada();
    listaRepresentanteEntrada.program = "pedido-web/buscaRepresentante.p";
    listaRepresentanteEntrada.user    = this.authService.getLoggedUserName();
    var listaRepresentanteRetorno = this.http.post<ListaRepresentanteRetorno>(environment.apiURL, listaRepresentanteEntrada);
    return listaRepresentanteRetorno;
  }
}
