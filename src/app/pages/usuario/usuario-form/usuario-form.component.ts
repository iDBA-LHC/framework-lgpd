import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { emailValidator } from 'src/app/shared/utils/app.validator';
import { Cliente } from 'src/app/models/cliente/cliente';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/models/empresa/empresa';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { Usuario } from 'src/app/models/usuario/usuario';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuarioForm: FormGroup;
  usuarioId: number;
  meuUsuario: boolean = false;

  listaEmpresas: Cliente[] = 
  [
    {
      codigoCliente: 1,
      nomeEmpresa: "Empresa 1"
    },
    {
      codigoCliente: 2,
      nomeEmpresa: "Empresa 2"
    }
  ]; 

  listaEmpresasFiltrados: Observable<Cliente[]>;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private usuarioService: UsuarioService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    if (this.router.url.indexOf("meu-usuario")!=-1){
      this.meuUsuario = true;
    }

    this.activatedRoute.params.subscribe((data) => {
      if (data["id?"]) {
        this.usuarioId = data["id?"];
        this.usuarioService
          .pesquisaUsuario(this.usuarioId)
          .subscribe((usuarioDetail) => {
            this.usuarioForm.patchValue({
              emailUsuario: usuarioDetail.emailUsuario,
              nomeUsuario: usuarioDetail.nomeUsuario,
              codigoCliente: usuarioDetail.codigoCliente,
              nomeEmpresa: usuarioDetail.nomeEmpresa,
              indAtivo: usuarioDetail.indAtivo,
              indAdmin: usuarioDetail.indAdmin
            });
          });
      }
    });

    this.createForm();

    this.listaEmpresasFiltrados = this.usuarioForm.controls.empresa.valueChanges
    .pipe(
      startWith(''),
      map(value => typeof value === 'string' ? value : value.nomeEmpresa),
      map(name => {
        return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
      })
    );
  }

  private createForm() {
    this.usuarioForm = this.formBuilder.group({
      nomeUsuario: ["", Validators.required],
      emailUsuario: ["", Validators.compose([Validators.required, emailValidator])],
      empresa: [Cliente, Validators.required],
      indAtivo: [true, ],
      indAdmin: [false,],
    });
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

  salvarUsuario()
  {
    if (this.usuarioForm.valid) {
      if (this.usuarioId) {
        const usuario: Usuario = this.usuarioForm.getRawValue();
        this.usuarioService.alterarUsuario(usuario).subscribe(
          (usuarioDetail) => {
            this.showMessage(
              `O Usuário ${usuarioDetail.nomeUsuario} foi atualizada com sucesso!`
              /*`O Usuário foi atualizada com sucesso!`*/
            );
            this.router.navigate(["/usuario"]);
          },
          (err) => {
            this.showMessage(err.error, "Error");
          }
        )
        /*const categoryUpdate: CategoryUpdateRequest = this.categoryForm.getRawValue();
        this.categoryService
          .updateCategory(this.categoryId, categoryUpdate)
          .subscribe(
            (categoryDetail) => {
              this.showMessage(
                `A categoria ${categoryDetail.description} foi atualizada com sucesso!`
              );
              this.router.navigate(["/category"]);
            },
            (err) => {
              this.showMessage(err.error, "Error");
            }
          );*/
      } else {
        /*const categoryNew: CategoryNewRequest = this.categoryForm.getRawValue();
        this.categoryService.createCategory(categoryNew).subscribe(
          (categoryResponse) => {
            this.showMessage(
              `A categoria ${categoryResponse.description} foi criada com sucesso!`
            );
            this.router.navigate(["/category"]);
          },
          (err) => {
            this.showMessage(err.error, "Error");
          }
        );*/
      }
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
    }
  }

  gerarSenha(usuario: Usuario)
  {
    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar Geração de Senha",
        msg: `Tem certeza que deseja prosseguir com a geração de senha do usuário ${usuario.nomeUsuario}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.usuarioService.gerarSenha(usuario.codigoUsuario).subscribe(
          () => {
            this.snackBar.openSnackBar(
              `Senha foi gerada com sucesso.`,
              null
            );
          },
          (err) => this.snackBar.openSnackBar(err.error, null, "Error")
        );
      }
    });
  }

  private filtraEmpresa(value: string): Cliente[] {
    const filterValue = value.toLowerCase();

    return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
  }

  displayEmpresa(cliente: Cliente): string {
    return cliente && cliente.nomeEmpresa ? cliente.nomeEmpresa : '';
  }

}