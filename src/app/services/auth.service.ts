import { AuthRequest } from "./../models/auth/auth-request";
import { Router } from "@angular/router";
import { environment } from "./../../environments/environment";
import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { HttpClient, HttpResponse } from "@angular/common/http";
import { JwtHelperService } from "@auth0/angular-jwt";
import { CustomSnackBarService } from '../shared/components/custom-snack-bar/custom-snack-bar.service';
import { AESService } from '../shared/components/aes/aesservice';
import { AuthData } from '../models/auth/auth-data';
import { TrataExcessaoConexao } from '../shared/utils/trata-excessao-conexao';

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
  token: string;

  constructor(
    private router: Router,
    private http: HttpClient,
    private helper: JwtHelperService,
    private snackBar: CustomSnackBarService,
    private aesService: AESService,

  ) {
    var token:string = localStorage.getItem(this.jwtTokenName);
    if (token) {

      if (environment.production)
      {
        token = aesService.decrypt(token);
      }

      this.loggedUserName = JSON.parse(token).nomeUsuario;
      this.loggedUserId = JSON.parse(token).codigoUsuario;
      this.loggedUserType = JSON.parse(token).indTipoUsuario;
      this.active = JSON.parse(token).indAtivo;
      this.loggedTime = JSON.parse(token).dataHoraLogin;
      this.token = JSON.parse(token).token;
      this.loggedIn.next(true);
    }
  }

  login(authRequest: AuthRequest) {    

    this.aesService = new AESService();

    //authRequest.password = aesService.encrypt(authRequest.password)

    this.http.post<AuthData>(environment.apiURL + "usuario/login", authRequest, { observe: 'response' }).subscribe( 
      resp => {        
        var authData: AuthData = new AuthData();
        authData = resp.body[0];
        authData.dataHoraLogin = new Date();
        authData.dataHoraValidade = new Date(authData.dataHoraLogin.getTime() + environment.timeout);
        this.setSession(authData);
        this.loggedIn.next(true);
        this.snackBar.openSnackBar("Bem vindo!", null);
        this.router.navigate(["/"]);
      },
      err=>{
        TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
      }
    );
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

  getToken()
  {
    return this.token;
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
    this.token = "";
    this.loggedIn.next(false);
    this.router.navigate(["/public/sign-in"]);
  }

  /*private handleJwtResponse(tokenResponse) {
    if (tokenResponse.OutputPars==="OK")
    {
      var authData:AuthData = new AuthData();
      //usuario.codigousuario = tokenResponse.retorno.usuario[0].codigoUsuario;
      
      authData.codigoUsuario = tokenResponse.
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
  }*/

  isTokenExpired(token?: string): boolean {
    if (!token) token = localStorage.getItem(this.jwtTokenName);
    if (!token) return true;    

    if (environment.production)
    {
      token = this.aesService.decrypt(token);
    }

    var authData = JSON.parse(token);
    var data = new Date();
    var dataValidade = new Date(authData.dataHoraValidade);

    return (data.getTime() > dataValidade.getTime());

  }

  private setSession(authData: AuthData)
  {
    var token: string = JSON.stringify(authData);
    if (environment.production)
    {
      token = this.aesService.encrypt(token);
    }
    localStorage.setItem(this.jwtTokenName, token);
    this.loggedUserName = authData.nomeUsuario;
    this.loggedUserId   = authData.codigoUsuario;
    this.loggedUserType = authData.indTipoUsuario;
    this.loggedTime     = authData.dataHoraLogin;
    this.token          = authData.token;
    this.loggedIn.next(true);
  }

  private getSession():boolean {
    var token:string = localStorage.getItem(this.jwtTokenName);
    if (!token) return false;
    if (environment.production)
    {
      token = this.aesService.decrypt(token);
    }
    let authData : AuthData = JSON.parse(token);
    if ( authData ){
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
    var authData = JSON.parse(token);
    authData.dataHoraValidade = new Date(new Date().getTime() + environment.timeout);
    this.setSession(authData);
  }

  renewSession(callBackFunction)
  {
    var token:string = localStorage.getItem(this.jwtTokenName);
    if (token) {

      this.aesService = new AESService();

      if (environment.production)
      {
        token = this.aesService.decrypt(token);
      }
      const authRequest: AuthRequest = {
        email: JSON.parse(token).emailUsuario,
        password: JSON.parse(token).senhaUsuario,
      };

      this.http.post<AuthData>(environment.apiURL + "usuario/login", authRequest, { observe: 'response' }).subscribe( 
        resp => {        
          var authData: AuthData = new AuthData();
          authData = resp.body[0];
          authData.dataHoraLogin = new Date();
          authData.dataHoraValidade = new Date(authData.dataHoraLogin.getTime() + environment.timeout);
          this.setSession(authData);
          callBackFunction();
        },
        err=>{
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      );
    }
  } 

}