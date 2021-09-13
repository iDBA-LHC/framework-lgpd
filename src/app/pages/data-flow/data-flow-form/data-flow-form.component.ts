import { Usuario2 } from './../../../models/usuario/usuario2';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { DataFlow } from 'src/app/models/data-flow/data-flow';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataFlowService } from 'src/app/services/data-flow.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { Usuario } from 'src/app/models/usuario/usuario';
import { UsuarioService } from 'src/app/services/usuario.service';
import { Atividade } from 'src/app/models/atividade/atividade';
import { Metadados } from 'src/app/models/metadados/metadados';
import { MetadadosService } from 'src/app/services/metadados.service';
import { AtividadeService } from 'src/app/services/atividade.service';
import { CicloDeVida } from 'src/app/models/ciclo-de-vida/ciclo-de-vida';
import { CicloDeVidaService } from 'src/app/services/ciclo-de-vida.service';

@Component({
  selector: 'app-data-flow-form',
  templateUrl: './data-flow-form.component.html',
  styleUrls: ['./data-flow-form.component.css']
})
export class DataFlowFormComponent implements OnInit {

  dataFlowForm: FormGroup;
  codDataFlow: number;
  isLoading = false;

  listaAtividade: Atividade[];

  listaMetadados: Metadados[];

  listaArmazenamentos: LocalArmazenamento[];
  listaArmazenamentosFiltrados: LocalArmazenamento[];

  listaCompartilhamentos: Compartilhamento[];
  listaCompartilhamentosFiltrados: Compartilhamento[];

  listaUsuarios: Usuario[];
  listaUsuariosFiltrados: Usuario[];

  listaCicloVida: CicloDeVida[];

  constructor(
    private atividadeService: AtividadeService,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private metadadosService: MetadadosService,
    private dialog: MatDialog,
    private DataFlowService: DataFlowService,
    private usuarioService: UsuarioService,
    private compartilhamentoService: CompartilhamentoService,
    private localArmazenamentoService: LocalArmazenamentoService,
    private cicloVidaService: CicloDeVidaService,
  ) { }

  ngOnInit() {
    //this.isLoading = true;

    this.createForm();
    this.pesquisaDataFlow();
  }

  private createForm() {
    this.dataFlowForm = this.formBuilder.group({
      nomeProcessamento: ["", Validators.required],
      codCicloMonitoramento: ["", Validators.required],

      codAtividade: ["", Validators.required],
      atividade: ["", Validators.required],
      codMetadados: ["", Validators.required],
      metadados: ["", Validators.required],
      indDescarte: ["", Validators.required],
      indRisco: ["", Validators.required],
      cicloVida: ["", Validators.required],
			codCicloVida: ["", Validators.required],
      codUsuarioInclusao: ["", Validators.required],
      armazenamentos: ["", Validators.required],
      compartilhamentos: ["", Validators.required],
      usuarios: ["", Validators.required],
      //codCicloMonitoramento: ["", Validators.required],
    });
  }

  pesquisaDataFlow() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.codDataFlow = parseInt(data["id?"]);

        if (this.codDataFlow) {
          this.DataFlowService.pesquisaDataFlow(this.codDataFlow).subscribe(
            (retorno) => {
              this.dataFlowForm.patchValue({
                codDataFlow: retorno.body[0].codDataFlow,

                nomeProcessamento: retorno.body[0].nomeProcessamento,

                codCicloMonitoramento: retorno.body[0].codCicloMonitoramento,

                codAtividade: retorno.body[0].codAtividade,

                codMetadados: retorno.body[0].codMetadados,

                indDescarte: retorno.body[0].indDescarte,

                indRisco: retorno.body[0].indRisco,

                codCicloVida: retorno.body[0].codCicloVida,

                codUsuarioInclusao: retorno.body[0].codUsuarioInclusao,

                armazenamentos: retorno.body[0].armazenamentos,

                compartilhamentos: retorno.body[0].compartilhamentos,
              });

              this.preencherCombos();
            },
            (err) => {
              if (err.status === 401) {
                TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaDataFlow(); }));
              }
              else {
                TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              }
            }
          );
        } else {
          this.preencherCombos();
        }
      }
    )
  }

  preencherCombos() {

    this.pesquisaLocalArmazenamento();

    this.pesquisaCompartilhamentos();

    this.pesquisaCicloVida();

    this.pesquisaAtividade();

    this.pesquisaMetadados();

  }

  salvarDataFlow() {
    if (this.dataFlowForm.valid) {
      const DataFlow: DataFlow = this.dataFlowForm.getRawValue();
      DataFlow.codDataFlow = this.codDataFlow;

      DataFlow.indRisco = (this.dataFlowForm.controls.indRisco.value ? 1 : 0);
      DataFlow.indDescarte = (this.dataFlowForm.controls.indDescarte.value ? 1 : 0);

      var usuarios2 = new Array();
      DataFlow.usuarios.forEach(function (e, i) {
        let usuario2: Usuario2 = new Usuario2;
        usuario2.codUsuario = e.codigoUsuario;
        usuarios2.push(usuario2);
      });
      DataFlow.usuarios = usuarios2;

      if (this.codDataFlow) {
        // Alteração
        this.DataFlowService.alterarDataFlow(DataFlow).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Data Map foi atualizado com sucesso!`, null);
            this.router.navigate(["/data-flow"]);
          },
          (err) => {
            if (err.status === 401) {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.salvarDataFlow(); }));
            }
            else {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.DataFlowService.incluirDataFlow(DataFlow).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Data Map foi criado com sucesso!`, null);
            this.router.navigate(["/data-flow"]);
          },
          (err) => {
            if (err.status === 401) {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.salvarDataFlow(); }));
            }
            else {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      }
    }
  }

  private pesquisaLocalArmazenamento() {
    this.localArmazenamentoService.listaTodosLocaisArmazenamento().subscribe(
      (retorno) => {
        this.listaArmazenamentosFiltrados = retorno.body;

        //let codigoEmpresa = this.dataMapForm.controls.codigoEmpresa.value;
        //this.listaArmazenamentosFiltrados = <LocalArmazenamento []>this.listaArmazenamentos.filter(model => model.codigoEmpresa == codigoEmpresa);
      }
    )
    this.isLoading = false;
  }

  compareArmazenamento(o1: any, o2: any): boolean {
    if (o2 != null)
      return o1.codLocalArmazenamento === o2.codLocalArmazenamento;
  }

  private pesquisaCompartilhamentos() {
    this.compartilhamentoService.listarTodosCompartilhamentos().subscribe(
      (retorno) => {
        this.listaCompartilhamentosFiltrados = retorno.body;

        //let codigoEmpresa = this.dataMapForm.controls.codigoEmpresa.value;
        //this.listaCompartilhamentosFiltrados = <Compartilhamento []>this.listaCompartilhamentos.filter(model => model.codigoEmpresa == codigoEmpresa);
      }
    )
    this.isLoading = false;
  }

  compareCompartilhamento(o1: any, o2: any): boolean {
    if (o2 != null)
      return o1.codCompartilhamento === o2.codCompartilhamento;
  }

  compareUsuarioSelecionado(o1: any, o2: any): boolean {
    if (o2 != null)
      return o1.codigoUsuario === o2.codUsuario;
  }

  private pesquisaUsuarios() {
    this.usuarioService.listaTodosUsuarios().subscribe(
      (retorno) => {
        this.listaUsuarios = retorno.body;

        let codEmpresa = this.dataFlowForm.controls.codEmpresa.value;

        this.listaUsuariosFiltrados = <Usuario[]>this.listaUsuarios.filter(usuario => usuario.codigoEmpresa == codEmpresa);
      }
    )
    this.isLoading = false;
  }

  selecionaUsuario(event) {
    let usuarioSelecionado: Usuario = event.option.value;
    this.dataFlowForm.controls.usuarios.setValue(usuarioSelecionado);
  }

  displayUsuario(usuario: Usuario): string {
    return usuario ? usuario.nomeUsuario : "";
  }

  displayAtividade(atividade: Atividade): string {
		return atividade ? atividade.nomeAtividade : "";
	}

  displayMetadados(metadados: Metadados): string {
		return metadados ? metadados.nomeMetadados : "";
	}

  selecionaAtividade(event) {
		let selecionado: Atividade = event.option.value;
		this.dataFlowForm.controls.atividade.setValue(selecionado);
		this.dataFlowForm.controls.codAtividade.setValue(selecionado.codAtividade);
	}

  selecionaMetadados(event) {
		let selecionado: Metadados = event.option.value;
		this.dataFlowForm.controls.metadados.setValue(selecionado);
		this.dataFlowForm.controls.codMetadados.setValue(selecionado.codMetadados);
	}

  private pesquisaAtividade() {
		this.atividadeService.listaAtivadadesPorProcesso(1).subscribe(
			(retorno) => {
				this.listaAtividade = retorno.body;

				if (this.dataFlowForm.controls.codAtividade.value != 0) {
					let atividade: Atividade = <Atividade>this.listaAtividade.filter(atividade => atividade.codAtividade == this.dataFlowForm.controls.codAtividade.value)[0];
					if (atividade) {
						this.dataFlowForm.controls.atividade.setValue(atividade);
					}
				}
			}
		)
		this.isLoading = false;
	}

  private pesquisaMetadados() {
		this.metadadosService.listaTodosMetadados().subscribe(
			(retorno) => {
				this.listaMetadados = retorno.body;

				if (this.dataFlowForm.controls.codMetadados.value != 0) {
					let metadados: Metadados = <Metadados>this.listaMetadados.filter(metadados => metadados.codMetadados == this.dataFlowForm.controls.codMetadados.value)[0];
					if (metadados) {
						this.dataFlowForm.controls.metadados.setValue(metadados);
					}
				}
			}
		)
		this.isLoading = false;
	}

  private pesquisaCicloVida() {
		this.cicloVidaService.listaTodosCiclosDeVida().subscribe(
			(retorno) => {
				this.listaCicloVida = retorno.body;

				if (this.dataFlowForm.controls.codCicloVida.value != 0) {
					let cicloVida: CicloDeVida = <CicloDeVida>this.listaCicloVida.filter(cicloVida => cicloVida.codCicloVida == this.dataFlowForm.controls.codCicloVida.value)[0];
					if (cicloVida) {
						this.dataFlowForm.controls.cicloVida.setValue(cicloVida);
					}
				}
			}
		)
		this.isLoading = false;
	}

	selecionaCicloVida(event) {
		let selecionado: CicloDeVida = event.option.value;
		this.dataFlowForm.controls.cicloVida.setValue(selecionado);
		this.dataFlowForm.controls.codCicloVida.setValue(selecionado.codCicloVida);
	}

	compareCicloVida(o1: any, o2: any): boolean {
		if (o2 != null)
			return o1.codCicloVida === o2.codCicloVida;
	}

	displayCicloVida(cicloVida: CicloDeVida): string {
		return cicloVida ? cicloVida.nomeCicloVida : "";
	}

}
