import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ListaEmpresaRetorno } from '../models/empresa/lista-empresa-retorno';
import { ListaEmpresaEntrada } from '../models/empresa/lista-empresa-entrada';
import { PesquisaEmpresaEntrada } from '../models/empresa/pesquisa-empresa-entrada';
import { Empresa } from '../models/empresa/empresa';
import { AlteraEmpresaEntrada } from '../models/empresa/altera-empresa-entrada';
import { AlteraEmpresaRetorno } from '../models/empresa/altera-empresa-retorno';
import { CriaEmpresaRetorno } from '../models/empresa/cria-empresa-retorno';
import { CriaEmpresaEntrada } from '../models/empresa/cria-empresa-entrada';
import { ExcluirEmpresaEntrada } from '../models/empresa/excluir-empresa-entrada';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  constructor(private http: HttpClient,
              private authService: AuthService, ) {}

  retornaTodasEmpresas(){
    var listaEmpresaEntrada = new ListaEmpresaEntrada();
    listaEmpresaEntrada.program    = "empresa/listar.p";
    listaEmpresaEntrada.user       = "super";
    listaEmpresaEntrada.parameters = {};
    var listaEmpresaRetorno = this.http.post<ListaEmpresaRetorno>(environment.apiURL, listaEmpresaEntrada);
    return listaEmpresaRetorno;
  }

  pesquisaEmpresa(rowid: string)
  {    
    var pesquisaEmpresaEntrada = new PesquisaEmpresaEntrada();
    pesquisaEmpresaEntrada.program = "empresa/pesquisar.p";
    pesquisaEmpresaEntrada.user    = this.authService.getLoggedUserName();
    pesquisaEmpresaEntrada.parameters = {rowid: rowid};
    return this.http.post<ListaEmpresaRetorno>(environment.apiURL, pesquisaEmpresaEntrada);;
  }

  alterarEmpresa(empresa: Empresa)
  {
    var alteraEmpresaEntrada = new AlteraEmpresaEntrada();
    alteraEmpresaEntrada.program = "empresa/alterar.p";
    alteraEmpresaEntrada.user    = this.authService.getLoggedUserName();
    alteraEmpresaEntrada.parameters = {empresas: [empresa]};;
    return this.http.post<AlteraEmpresaRetorno>(environment.apiURL, alteraEmpresaEntrada);
  }

  criarEmpresa(empresa: Empresa)
  {
    var criaEmpresaEntrada = new CriaEmpresaEntrada();
    criaEmpresaEntrada.program = "empresa/criar.p";
    criaEmpresaEntrada.user    = this.authService.getLoggedUserName();
    criaEmpresaEntrada.parameters = {empresas: [empresa]};;
    return this.http.post<CriaEmpresaRetorno>(environment.apiURL, criaEmpresaEntrada);
  }

  excluirEmpresa(rowid: string)
  {
    var excluirEmpresaEntrada = new ExcluirEmpresaEntrada();
    excluirEmpresaEntrada.program = "empresa/excluir.p";
    excluirEmpresaEntrada.user    = this.authService.getLoggedUserName();
    excluirEmpresaEntrada.parameters = {rowid: rowid};
    return this.http.post<ListaEmpresaRetorno>(environment.apiURL, excluirEmpresaEntrada);
  }
}
