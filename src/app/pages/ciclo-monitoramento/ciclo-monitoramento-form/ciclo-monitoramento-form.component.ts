import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { CicloMonitoramento } from 'src/app/models/ciclo-monitoramento/ciclo-monitoramento';
import { Empresa } from 'src/app/models/empresa/empresa';
import { Usuario } from 'src/app/models/usuario/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { CicloMonitoramentoService } from 'src/app/services/ciclo-monitoramento.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-ciclo-monitoramento-form',
  templateUrl: './ciclo-monitoramento-form.component.html',
  styleUrls: ['./ciclo-monitoramento-form.component.css']
})
export class CicloMonitoramentoFormComponent implements OnInit {

  cicloMonitoramentoForm: FormGroup;
  cicloMonitoramentoId: number;
  cicloMonitoramentoUsuarioCriado: number;
  isLoading = false;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

  listaUsuarios: Usuario[];
  listaUsuariosFiltrados: Usuario[];

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private cicloMonitoramentoService: CicloMonitoramentoService,
    private empresaService: EmpresaService,
    private usuarioService: UsuarioService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isLoading = true;
    this.createForm();
    this.pesquisaCicloMonitoramento();
  }

  private createForm() {
    this.cicloMonitoramentoForm = this.formBuilder.group({
      nomeCicloMonitoramento: ["", Validators.required],
      codEmpresa: [0, ],
      empresa: ["", Validators.required],
      dataCompetencia: ["", Validators.required],
      usuarios: ["", Validators.required],
    });
  }

  private pesquisaCicloMonitoramento() {
    this.activatedRoute.params.subscribe((data) => {
      if (data["id?"]) {
        this.cicloMonitoramentoId = data["id?"];
        this.cicloMonitoramentoService.pesquisaCicloMonitoramento(this.cicloMonitoramentoId).subscribe(
          (retorno) => {
            console.log("Retorno", retorno);
            this.cicloMonitoramentoForm.patchValue({
              nomeCicloMonitoramento: retorno.body[0].nomeCicloMonitoramento,
              codEmpresa: retorno.body[0].codEmpresa,
              dataCompetencia: retorno.body[0].dataCompetencia
            });
            this.cicloMonitoramentoUsuarioCriado = retorno.body[0].codUsuarioInclusao;
            
            this.pesquisaEmpresas();
          });
      } else {
        this.pesquisaEmpresas();
      }
    });
  }

  private pesquisaEmpresas() {
    this.empresaService.listaTodasEmpresas().subscribe(
      (retorno) => {
        this.listaEmpresas = retorno.body;

        let codEmpresa = this.cicloMonitoramentoForm.controls.codEmpresa.value;
        if (codEmpresa != 0) {
          let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
          if (empresaSel)
            this.cicloMonitoramentoForm.controls.empresa.setValue(empresaSel);
        }

        this.listaEmpresasFiltradas = this.cicloMonitoramentoForm.controls.empresa.valueChanges
        .pipe(
          startWith(''),
          map(value => typeof value === 'string' ? value : value.nomeEmpresa),
          map(name => {
            return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
          }));

        this.pesquisaUsuarios();
      }
    )
  }

  private filtraEmpresa(value: string): Empresa[] {
    const filterValue = value.toLowerCase();

    return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
  }

  selecionaEmpresa(event) {
    let empresaSelecionada: Empresa = event.option.value;
    this.cicloMonitoramentoForm.controls.empresa.setValue(empresaSelecionada);
    this.cicloMonitoramentoForm.controls.codEmpresa.setValue(empresaSelecionada.codigoEmpresa);

    this.isLoading = true;
    this.pesquisaUsuarios();
  }

  displayEmpresa(empresa: Empresa): string {
    return empresa ? empresa.nomeEmpresa : "";
  }

  private pesquisaUsuarios() {
    this.usuarioService.listaTodosUsuarios().subscribe(
      (retorno) => {
        this.listaUsuarios = retorno.body;

        let codEmpresa = this.cicloMonitoramentoForm.controls.codEmpresa.value;
        
        this.listaUsuariosFiltrados = <Usuario []>this.listaUsuarios.filter(usuario => usuario.codigoEmpresa == codEmpresa);
      }
    )
    this.isLoading = false;
  }

  selecionaUsuario(event) {
    console.log("Selecao", event.option.value);
    let usuarioSelecionado: Usuario = event.option.value;
    this.cicloMonitoramentoForm.controls.usuarios.setValue(usuarioSelecionado);
  }

  displayUsuario(usuario: Usuario): string {
    return usuario ? usuario.nomeUsuario : "";
  }

  salvarCicloMonitoramento() {
    if (this.cicloMonitoramentoForm.valid) {
      const ciclo: CicloMonitoramento = this.cicloMonitoramentoForm.getRawValue();
      ciclo.codCicloMonitoramento = this.cicloMonitoramentoId;

      if (this.cicloMonitoramentoId) {
        // Alteração
        ciclo.codUsuarioInclusao = this.cicloMonitoramentoUsuarioCriado;
        this.cicloMonitoramentoService.alterarCicloMonitoramento(ciclo).subscribe(
          (retorno) => {
            this.snackBar.openSnackBar(`O Ciclo Monitoramento ${ciclo.nomeCicloMonitoramento} foi atualizado com sucesso!`,null);
            this.router.navigate(["/ciclo-monitoramento"]);
          }
        );
      } else {
        // Inclusão
        ciclo.codUsuarioInclusao = this.authService.loggedUserId;
        this.cicloMonitoramentoService.incluirCicloMonitoramento(ciclo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Ciclo Monitoramento ${ciclo.nomeCicloMonitoramento} foi criado com sucesso!`,null);
            this.router.navigate(["/ciclo-monitoramento"]);
          }
        )
      }
      console.log("Salvar", ciclo);
    }
  }
}
