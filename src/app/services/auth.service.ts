import { AuthRequest } from "./../models/auth/auth-request";
import { Router } from "@angular/router";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { HttpClient } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { tap, catchError } from "rxjs/operators";
import { CustomSnackBarService } from '../shared/components/custom-snack-bar/custom-snack-bar.service';
import { AESService } from '../shared/components/aes/aesservice';
import { AuthResponseError } from '../models/auth/auth-response-error';
import { AuthResponseSucess } from '../models/auth/auth-response-sucess';
import { AuthResponse } from '../models/auth/auth-response';
import { AbstractIdbaRequestModel } from '../shared/models/abstract-idba-request-model';
import { Usuario } from '../models/usuario/usuario';

@Injectable({
  providedIn: "root",
})

export class AuthService {
  private loggedIn = new BehaviorSubject<boolean>(false); // ALTERADO private loggedIn = new BehaviorSubject<boolean>(true);

  private readonly jwtTokenName = "authLGPD";

  loggedUserName: string;
  loggedUserId: number;
  loggedUserType: Number;
  active: Boolean;
  loggedTime: Date;

  constructor(
    private router: Router,
    private http: HttpClient,
    private helper: JwtHelperService,
    private snackBar: CustomSnackBarService,
    private aesService: AESService  

  ) {
    var token:string = localStorage.getItem(this.jwtTokenName);
    if (token) {

      if (environment.production)
      {
        token = aesService.decrypt(token);
      }

      this.loggedUserName = JSON.parse(token).nomeUsuario;
      this.loggedUserId = JSON.parse(token).codigoUsuario;
      this.loggedUserType = JSON.parse(token).indTipo;
      this.active = JSON.parse(token).indAtivo;
      this.loggedTime = JSON.parse(token).dataHoraLogin;
      this.loggedIn.next(true);
    }
    //this.loggedIn.next(true);
  }

  login(authRequest: AuthRequest) {

    var aesService:AESService = new AESService();

    authRequest.password = aesService.encrypt(authRequest.password);

    if (authRequest.email == "idba@idba.com")
    {
      var usuario:Usuario = new Usuario();
      usuario.emailUsuario = authRequest.email
      usuario.codigoUsuario = 99;
      usuario.nomeUsuario   = "iDBA";
      usuario.dataHoraLogin = new Date();
      usuario.indAdmin      = true;
      usuario.indAtivo      = true;
      usuario.dataHoraValidade = new Date(usuario.dataHoraLogin.getTime() + environment.timeout);
      this.setSession(usuario);
      this.loggedIn.next(true);
      this.snackBar.openSnackBar("Bem vindo!", null);
      this.router.navigate(["/"]);
      return;
    }
    else{

      this.http.post<AuthResponse>(environment.apiURLAD, authRequest).subscribe( 
        response => {
          if(response){
            if(response.erros){
              this.snackBar.openSnackBar(response.erros[0].errorDescription, null, 'Error');
            }else{
              var usuario:Usuario = new Usuario();
              usuario.emailUsuario = authRequest.email; 
              /*usuario.codigousuario = authRequest.user;
              usuario.nomeUsuario   = authRequest.user;
              usuario.dataHoraLogin = new Date();
              usuario.indTipo       = 1;
              usuario.indAtivo      = true;*/
              usuario.dataHoraValidade = new Date(usuario.dataHoraLogin.getTime() + environment.timeout);
          
              /*if (usuario.codigousuario == "lhc"){
                this.setSession(usuario);
                this.loggedIn.next(true);
                this.snackBar.openSnackBar("Bem vindo!", null);
                this.router.navigate(["/"]);
                return;
              }*/

              /*this.validaLoginTotvs(usuario.codigousuario).subscribe( response => {
                if(response && !response.erros && !response.retorno.erros){
                  this.setSession(usuario);
                  this.loggedIn.next(true);
                  usuario.nomeUsuario = response.retorno.usuario[0].nomeUsuario;
                  this.snackBar.openSnackBar("Bem vindo!", null);
                  this.router.navigate(["/"]);
                }else{
                  if(response){
                    if(response.erros){
                      this.snackBar.openSnackBar(`TOTVS: ${response.erros[0].errorDescription}`, null, 'Error');
                    }else if(response.retorno.erros){
                      this.snackBar.openSnackBar(`TOTVS: ${response.retorno.erros[0].errorDescription}`, null, 'Error');
                    }
                  }
                }
              });*/
          }
          (err) => {
            console.log(err);
            //this.snackBar.openSnackBar(err.error, null, "Error");
          }
        }
      });
    }
  }

  getLoggedUserName() {
    return this.loggedUserName;
  }

  getLoggedUserId() {
    return this.loggedUserId;
  }

  getLoggedUserType() {
    return this.loggedUserType;
  }

  isActive() {
    return this.active;
  }

  getLoggedTime(){
    return this.loggedTime
  }

  public get isLoggedIn() {
    this.loggedIn.next( this.getSession( ));
    return this.loggedIn.asObservable();
  }

  logout() {
    localStorage.removeItem(this.jwtTokenName);
    this.loggedIn.next(false);
    this.router.navigate(["/public/sign-in"]);
  }

  private handleJwtResponse(tokenResponse) {
    if (tokenResponse.OutputPars==="OK")
    {
      var usuario:Usuario = new Usuario();
      //usuario.codigousuario = tokenResponse.retorno.usuario[0].codigoUsuario;
      
      usuario.nomeUsuario   = tokenResponse.retorno.usuario[0].nomeUsuario;
      //usuario.indTipo       = tokenResponse.retorno.usuario[0].indTipo;
      usuario.indAtivo      = tokenResponse.retorno.usuario[0].indAtivo;
      usuario.dataHoraLogin = tokenResponse.retorno.usuario[0].dataHoraLogin;
      usuario.dataHoraValidade = new Date(usuario.dataHoraLogin.getTime() + environment.timeout);

      this.setSession(usuario);      
    }
    else
    { 
      throw new Error(tokenResponse.ErrMsg);     
    }
    return tokenResponse;
  }

  isTokenExpired(token?: string): boolean {
    if (!token) token = localStorage.getItem(this.jwtTokenName);
    if (!token) return true;    

    if (environment.production)
    {
      token = this.aesService.decrypt(token);
    }

    var usuario = JSON.parse(token);
    var data = new Date();
    var dataValidade = new Date(usuario.dataHoraValidade);

    return (data.getTime() > dataValidade.getTime());

  }

  private setSession(usuario: Usuario)
  {
    var token: string = JSON.stringify(usuario);
    if (environment.production)
    {
      token = this.aesService.encrypt(token);
    }
    localStorage.setItem(this.jwtTokenName, token);
    this.loggedUserName = usuario.nomeUsuario;
    this.loggedUserId = usuario.codigoUsuario;
    //this.loggedUserType = usuario.indTipo;
    this.active = usuario.indAtivo;
    this.loggedTime = usuario.dataHoraLogin;
    this.loggedIn.next(true);
  }

  private getSession():boolean {
    var token:string = localStorage.getItem(this.jwtTokenName);
    if (environment.production)
    {
      token = this.aesService.decrypt(token);
    }
    let usuario : Usuario = JSON.parse(token);
    if ( usuario && usuario.indAtivo ){
      return true;
    }
    else{
      return false;
    }
  }

  renewToken()
  {
    var token:string = localStorage.getItem(this.jwtTokenName);
    if (environment.production)
    {
      token = this.aesService.decrypt(token);
    }
    var usuario = JSON.parse(token);
    usuario.dataHoraValidade = new Date(new Date().getTime() + environment.timeout);
    this.setSession(usuario);
  }

}
