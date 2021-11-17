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

  excluirEmpresa(empresa: Empresa)
  {
    return this.http.delete(environment.apiURL + "empresa/" + empresa.codigoEmpresa , { observe: "response" });
  }
}
