import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { emailValidator } from 'src/app/shared/utils/app.validator';
import { Observable } from 'rxjs';
import { Empresa } from 'src/app/models/empresa/empresa';
import { startWith, map } from 'rxjs/operators';
import { MatDialog } from '@angular/material';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { Usuario } from 'src/app/models/usuario/usuario';
import { EmpresaService } from 'src/app/services/empresa.service';
import { Area } from 'src/app/models/area/area';
import { AuthService } from 'src/app/services/auth.service';
import { TipoUsuarioButtons } from 'src/app/models/usuario/buttons/tipo-usuario-buttons';
import { NivelAcessoButtons } from 'src/app/models/usuario/buttons/nivel-acesso-buttons';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-usuario-form',
  templateUrl: './usuario-form.component.html',
  styleUrls: ['./usuario-form.component.css']
})
export class UsuarioFormComponent implements OnInit {

  usuarioForm: FormGroup;
  usuarioId: number;
  meuUsuario: boolean = false;
  isLoading = false;
  empresaAnt: Empresa;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;
  listaAreas: Area[];
  listaAreasFiltradas: Observable<Area[]>;

  tipoUsuarioButtons = new TipoUsuarioButtons();
  nivelAcessoButtons = new NivelAcessoButtons();

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private usuarioService: UsuarioService,
    private empresaService: EmpresaService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {

    this.isLoading = true;

    if (this.router.url.indexOf("meu-usuario")!=-1){
      this.meuUsuario = true;
    }

    this.createForm();    
    this.pesquisaUsuario();

  }

  private createForm() {
    this.usuarioForm = this.formBuilder.group({
      nomeUsuario: ["", Validators.required],
      emailUsuario: ["", Validators.compose([Validators.required, emailValidator])],
      codigoEmpresa: [0,],
      empresa: [Empresa, Validators.required],
      chaveExternaUsuario: ["", ],
      codigoArea: [0,],
      area: [Area, Validators.required ],
      indAtivo: [true, ],
      indTipoUsuario: [, Validators.required],
      indNivelAcesso: [, Validators.required]
    });
  }

  private pesquisaUsuario()
  {
    this.activatedRoute.params.subscribe((data) => {
      if (data["id?"]) {
        this.usuarioId = data["id?"];
        this.usuarioService.pesquisaUsuario(this.usuarioId).subscribe(
            (retorno) => {

              this.usuarioForm.patchValue({
                emailUsuario: retorno.body[0].emailUsuario,
                nomeUsuario: retorno.body[0].nomeUsuario,
                chaveExternaUsuario: retorno.body[0].chaveExternaUsuario,
                codigoEmpresa: retorno.body[0].codigoEmpresa,
                codigoArea: retorno.body[0].codigoArea,
                nomeEmpresa: retorno.body[0].nomeEmpresa,
                indAtivo: retorno.body[0].indAtivo,
                indTipoUsuario: retorno.body[0].indTipoUsuario,
                indNivelAcesso: retorno.body[0].indNivelAcesso
              });  
              
              this.pesquisaEmpresas();
            },
            (err) =>{
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaUsuario();}));
              }
              else
              {
                TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
            });
      }
      else
      {
        this.pesquisaEmpresas();
      }
    }); 
  }

  salvarUsuario()
  {
    if (this.usuarioForm.valid) {
      const usuario: Usuario = this.usuarioForm.getRawValue();        
      usuario.codigoUsuario = this.usuarioId;
      usuario.codigoArea = this.usuarioForm.controls.area.value.codArea;
      if (this.usuarioId) {     
        //Alteração
        if (this.meuUsuario)
        {
          this.usuarioService.alterarMeuUsuario(usuario).subscribe(
            (response) => {
              this.snackBar.openSnackBar(`Meu Usuário foi atualizado com sucesso!`,null);
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarUsuario();}));
              }
              else
              {
                TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
            }
          );
        }
        else 
        {

          this.usuarioService.alterarUsuario(usuario).subscribe(
            (response) => {
              this.snackBar.openSnackBar(`O Usuário ${usuario.nomeUsuario} foi atualizado com sucesso!`,null);
              this.router.navigate(["/usuario"]);
            },
            (err) => {
              if (err.status === 401)
              {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarUsuario();}));
              }
              else
              {
                TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
            }
          );
        }
      }
      else
      {
        //Inclusão
        this.usuarioService.incluirUsuario(usuario).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Usuário ${usuario.nomeUsuario} foi criado com sucesso!`,null);
            this.router.navigate(["/usuario"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarUsuario();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        );
      }
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
    }
  }

  alterarSenha($event)
  {
    $event.preventDefault();
    this.router.navigate(["/muda-senha"]);
  }

  gerarSenha($event)
  {
    $event.preventDefault();
    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar Geração de Senha",
        msg: `Tem certeza que deseja prosseguir com a geração de senha do usuário?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.isLoading = true;
        const usuario: Usuario = this.usuarioForm.getRawValue();        
        usuario.codigoUsuario = this.usuarioId;
        this.usuarioService.gerarSenha(usuario).subscribe(
          () => {
            this.snackBar.openSnackBar(
              `Senha foi gerada com sucesso. O Usuário Irá Receber um E-mail Com as Instruções Para Acesso`,
              null);
            this.isLoading = false;  
          },
          (err) => {
            this.isLoading = false;  
            this.snackBar.openSnackBar(err.error, null, "Error");
          }
        );
      }
    });
  }

  private pesquisaEmpresas()
  {
    this.empresaService.listaTodasEmpresas().subscribe(
      (retorno) => {
        this.listaEmpresas = retorno.body;

        if (this.usuarioForm.controls.codigoEmpresa.value!=0)
        {
          let empresa: Empresa;
          empresa = <Empresa>this.listaEmpresas.filter( empresa => empresa.codigoEmpresa == this.usuarioForm.controls.codigoEmpresa.value)[0];
          if(empresa){
            this.usuarioForm.controls.empresa.setValue(empresa);
            this.pesquisaAreasEmpresa(empresa);
          }
        }

        this.listaEmpresasFiltradas = this.usuarioForm.controls.empresa.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nomeEmpresa),
          map(name => {
            return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
          }));

        this.isLoading = false;  
      },
      (err) =>{
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaEmpresas();}));
        }
        else
        {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }
    );
  }
  
  private filtraEmpresa(value: string): Empresa[] {
    const filterValue = value.toLowerCase();

    return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
  }

  displayEmpresa(empresa: Empresa): string {
    return empresa ? empresa.nomeEmpresa : "";
  }

  selecionaEmpresa(event){
    let empresaSelecionada : Empresa = event.option.value;
    this.isLoading = true;

    if (empresaSelecionada)
    {      
      //Só consultar no BD se houve alteração da empresa selecionada
      if (empresaSelecionada != this.empresaAnt)
      {
        this.usuarioForm.controls.area.setValue("");
        this.pesquisaAreasEmpresa(empresaSelecionada);        
        this.empresaAnt = empresaSelecionada;
      }
    }

    this.isLoading = false;
  }

  private pesquisaAreasEmpresa(empresa: Empresa)
  {
    this.empresaService.listaAreasEmpresa(empresa).subscribe(
      (retorno) => {
        this.listaAreas = retorno.body;

        if (this.usuarioForm.controls.codigoArea.value!=0)
        {
          let area: Area;
          area = <Area>this.listaAreas.filter( area => area.codArea == this.usuarioForm.controls.codigoArea.value)[0];
          if(area){
            this.usuarioForm.controls.area.setValue(area);
          }
        }

        this.listaAreasFiltradas = this.usuarioForm.controls.area.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nomeArea),
          map(name => {
            return name ? this.filtraArea(name) : this.listaAreas.slice();
          }));
      },
      (err) =>{
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaAreasEmpresa(empresa);}));
        }
        else
        {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }

    );
  }

  private filtraArea(value: string): Area[] {
    const filterValue = value.toLowerCase();

    return this.listaAreas.filter(item => item.nomeArea.trim().toLowerCase().includes(filterValue));
  }

  displayArea(area: Area): string {
    return area && area.nomeArea ? area.nomeArea : '';
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }


}