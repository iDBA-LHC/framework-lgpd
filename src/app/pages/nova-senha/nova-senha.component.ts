import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { AESService } from 'src/app/shared/components/aes/aesservice';
import { matchingPasswords } from 'src/app/shared/utils/app.validator';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { MatDialog } from '@angular/material';
import { Usuario } from 'src/app/models/usuario/usuario';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nova-senha',
  templateUrl: './nova-senha.component.html',
  styleUrls: ['./nova-senha.component.css']
})
export class NovaSenhaComponent implements OnInit {

  novaSenhaForm: FormGroup;
  ambiente: String;
  token: string;
  isLoading: boolean;
  usuario:Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private snackBar: CustomSnackBarService,
    private usuarioService: UsuarioService,
    private dialog: MatDialog,
    private aesService: AESService,
    private authService: AuthService,
  ) { }

  ngOnInit() {

    this.ambiente = environment.envDesc;
    this.authService.invalidateSession();

    this.novaSenhaForm = this.formBuilder.group({
      nomeUsuario: ["",],
      emailUsuario: ["",],
      novaSenha: ["", Validators.compose([Validators.required])],
      confirmaNovaSenha: ["", Validators.compose([Validators.required])]
    }, { validator: matchingPasswords("novaSenha","confirmaNovaSenha") });


    this.activatedRoute.params.subscribe(
      (data) => {
        var tokenSenha:string = data["id?"];

        if (tokenSenha === undefined)
        {
          this.snackBar.openSnackBar("Token Inválido","","Error");
          this.router.navigate(["/public/sign-in"]);
          return;
        }
        this.token = this.aesService.decrypt(tokenSenha);
        if (!this.IsJsonString(this.token))
        {
          this.snackBar.openSnackBar("Token Inválido","","Error");
          this.router.navigate(["/public/sign-in"]);
          return; 
        }

        var tokenData = JSON.parse(this.token);

        var dataAux = new Date();
        var dataValidade = new Date(tokenData.dataLimite);

        if (dataAux.getTime() > dataValidade.getTime())
        {
          this.snackBar.openSnackBar("Validade do Token Expirada. Solicite Novamente a Geração de Sua Senha","","Error");
          this.router.navigate(["/public/sign-in"]);
          return; 
        }

        this.usuario = new Usuario();
        this.usuario.codigoUsuario = tokenData.codigoUsuario;
        this.usuario.nomeUsuario = tokenData.nomeUsuario;
        this.usuario.emailUsuario = tokenData.email;

        this.novaSenhaForm.controls.nomeUsuario.setValue(tokenData.nomeUsuario);
        this.novaSenhaForm.controls.emailUsuario.setValue(tokenData.email);        

      });
  }

  private IsJsonString(str:string) {
    try {
        JSON.parse(str);
    } catch (e) {
        return false;
    }
    return true;
}

  public criarNovaSenha()
  {
    if (this.novaSenhaForm.valid) {
      const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: "Confirmar Alteração de Senha",
          msg: `Tem certeza que deseja prosseguir com a alteração da senha do usuário ${this.novaSenhaForm.controls.nomeUsuario.value}?`,
        },
      });
  
      confirmRemoveDialog.afterClosed().subscribe((result) => {
        if (result) {
          this.usuario.senhaUsuario  = this.novaSenhaForm.controls.novaSenha.value;
          this.usuario.senhaUsuario = this.aesService.criptogrfaSenha(this.usuario.senhaUsuario);
          this.confirmaAlteracaoSenha(this.usuario);
          this.isLoading = true;
        }
      });
    }
    else {
        this.showMessage("Verifique a Senha Informada", "Warn");
    }
  }

  private confirmaAlteracaoSenha(usuario:Usuario)
  {
    this.isLoading = true;
    
    this.usuarioService.alterarSenhaUsuario(usuario).subscribe(
      (response) => {
        this.isLoading = false;
        this.snackBar.openSnackBar(
          `Senha do Usuário ${this.usuario.nomeUsuario} foi alterada com sucesso.`, null);
          this.router.navigate(["/public/sign-in"]);
      },
      (err) => {
        {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      });
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

}
