import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Empresa } from '../models/empresa/empresa';
import { AuthService } from './auth.service';
import { Area } from '../models/area/area';

@Injectable({
  providedIn: 'root'
})
export class EmpresaService {
  constructor(private http: HttpClient,
              private authService: AuthService, ) {}

  listaTodasEmpresas()
  {
    return this.http.get<Empresa[]>(environment.apiURL + "empresa", { observe: "response" });
  }   
  
  listaAreasEmpresa(empresa: Empresa)
  {
    return this.http.get<Area[]>(environment.apiURL + "empresa/" + empresa.codigoEmpresa.toString() + "/area", { observe: "response" });
  }

  pesquisaEmpresa(id: number)
  {
    return this.http.get<Empresa>(environment.apiURL + "empresa/" + id.toString(), { observe: "response" });
  }

  alterarEmpresa(empresa: Empresa)
  {
    return this.http.put<Empresa>(environment.apiURL + "empresa/" + empresa.codigoEmpresa , empresa, { observe: "response" });
  }

  incluirEmpresa(empresa: Empresa)
  {
    return this.http.post(environment.apiURL + "empresa" , empresa, { observe: "response" });
  }

  /*retornaTodasEmpresas(){
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
  }*/
}
