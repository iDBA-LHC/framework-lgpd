import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario/usuario';
import { HttpClient, HttpResponse} from '@angular/common/http';
import { AESService } from '../shared/components/aes/aesservice';
import { environment } from 'src/environments/environment';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})


export class UsuarioService {

  constructor(
    private http: HttpClient,
    private aesService: AESService,
    private authService: AuthService,
  ) { }

  listaTodosUsuarios(mostraInativos: boolean)
  {
    return this.http.get<Usuario[]>(environment.apiURL + `usuario/status/${mostraInativos}`, { observe: "response" });
  }

  pesquisaUsuario(id: number)
  {
    return this.http.get<Usuario>(environment.apiURL + "usuario/" + id.toString(), { observe: "response" });
  }

  gerarSenha(usuario: Usuario)
  {
    return this.http.post(environment.apiURL + "usuario/gerasenha/" , usuario, { observe: "response" });
  }

  inativarUsuario(usuario: Usuario)
  {
    return this.http.put<Usuario>(environment.apiURL + "usuario/" + usuario.codigoUsuario + "/status", usuario, { observe: "response" });
  }

  alterarUsuario(usuario: Usuario)
  {
    return this.http.put<Usuario>(environment.apiURL + "usuario/" + usuario.codigoUsuario , usuario, { observe: "response" });
  }

  alterarSenhaUsuario(usuario: Usuario)
  {
    return this.http.put<Usuario>(environment.apiURL + "usuario/" + usuario.codigoUsuario + "/senha", usuario, { observe: "response" });
  }

  alterarMeuUsuario(usuario: Usuario)
  {
    return this.http.put<Usuario>(environment.apiURL + "meu-usuario/" + usuario.codigoUsuario , usuario, { observe: "response" });
  }

  incluirUsuario(usuario: Usuario)
  {
    return this.http.post(environment.apiURL + "usuario/" , usuario, { observe: "response" });
  }

}
