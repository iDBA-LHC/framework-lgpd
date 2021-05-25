import { Injectable } from '@angular/core';
import { Usuario } from '../models/usuario/usuario';
import { HttpClient } from '@angular/common/http';
import { AESService } from '../shared/components/aes/aesservice';

@Injectable({
  providedIn: 'root'
})
export class UsuarioService {

  constructor(
    private http: HttpClient,
    private aesService: AESService
  ) { }

  pesquisaUsuario(id: number)
  {
    return this.http.get<Usuario>("" + id);
  }

  gerarSenha(id: number)
  {
    return this.http.get<Usuario>("" + id);
  }

  inativarUsuario(id: number)
  {
    return this.http.get<Usuario>("" + id);
  }

  alterarUsuario<Usuario>(usuario: Usuario)
  {
    console.log(JSON.stringify(usuario));
    console.log(this.aesService.encrypt(JSON.stringify(usuario)));
    return this.http.post<Usuario>("", usuario);
  }

  criarUsuario<Usuario>(usuario: Usuario)
  {
    /*console.log(JSON.stringify(usuario));
    console.log(this.aesService.encrypt(JSON.stringify(usuario)));*/
    return this.http.post<Usuario>("", usuario);
  }

}
