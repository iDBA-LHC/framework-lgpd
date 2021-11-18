import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
import { matchingPasswords } from 'src/app/shared/utils/app.validator';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Usuario } from 'src/app/models/usuario/usuario';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { AESService } from 'src/app/shared/components/aes/aesservice';

@Component({
  selector: 'app-muda-senha',
  templateUrl: './muda-senha.component.html',
  styleUrls: ['./muda-senha.component.css']
})

export class MudaSenhaComponent implements OnInit {

  mudaSenhaForm: FormGroup;
  isLoading: boolean = false;
  usuario: Usuario;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private router: Router,
    private dialog: MatDialog,
    private snackBar: CustomSnackBarService,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private aesService: AESService,
  ) {}

  ngOnInit() {

    this.usuario = new Usuario();

    this.mudaSenhaForm = this.formBuilder.group({
      nomeUsuario: ["",],
      emailUsuario: ["",],
      novaSenha: ["", Validators.compose([Validators.required])],
      confirmaNovaSenha: ["", Validators.compose([Validators.required])]
    }, { validator: matchingPasswords("novaSenha","confirmaNovaSenha") });


    this.mudaSenhaForm.controls.emailUsuario.setValue(this.authService.loggedUserEmail);
    this.mudaSenhaForm.controls.nomeUsuario.setValue(this.authService.loggedUserName);    
    this.usuario.codigoUsuario = this.authService.getLoggedUserId();  

  }

  alterarSenha()
  {
    if (this.mudaSenhaForm.valid) {
      const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
        data: {
          title: "Confirmar Alteração de Senha",
          msg: `Tem certeza que deseja prosseguir com a alteração da senha do usuário ${this.authService.loggedUserName}?`,
        },
      });
  
      confirmRemoveDialog.afterClosed().subscribe((result) => {
        if (result) {
          this.usuario.senhaUsuario  = this.mudaSenhaForm.controls.novaSenha.value;
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
          `Senha do Usuário ${this.authService.loggedUserName} foi alterada com sucesso.`, null);
        if (this.authService.isLoggedIn)
        {
          this.router.navigate(["/meu-usuario",usuario.codigoUsuario]);
        }
      },
      (err) => {
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaAlteracaoSenha(usuario);}));
        }
        else
        {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      });
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }
}
