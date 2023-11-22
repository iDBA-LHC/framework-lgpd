import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource, MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Area } from 'src/app/models/area/area';
import { BaseLegal } from 'src/app/models/base-legal/base-legal';
import { CicloDeVida } from 'src/app/models/ciclo-de-vida/ciclo-de-vida';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { DataMap } from 'src/app/models/data-map/data-map';
import { Empresa } from 'src/app/models/empresa/empresa';
import { FormaColeta } from 'src/app/models/forma-coleta/forma-coleta';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { Metadados } from 'src/app/models/metadados/metadados';
import { PlanoMitigacao } from 'src/app/models/plano-mitigacao/plano-mitigacao';
import { Processo } from 'src/app/models/processo/processo';
import { AreaService } from 'src/app/services/area.service';
import { AuthService } from 'src/app/services/auth.service';
import { BaseLegalService } from 'src/app/services/base-legal.service';
import { CicloDeVidaService } from 'src/app/services/ciclo-de-vida.service';
import { CicloMonitoramentoService } from 'src/app/services/ciclo-monitoramento.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { FormaColetaService } from 'src/app/services/forma-coleta.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { PlanoMitigacaoService } from 'src/app/services/plano-mitigacao.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { Atividade } from './../../../models/atividade/atividade';
import { AtividadeService } from './../../../services/atividade.service';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { DataFlowService } from 'src/app/services/data-flow.service';
import { Risco } from 'src/app/models/risco/risco';
import { RiscoService } from 'src/app/services/risco.service';
import { AmeacaService } from 'src/app/services/ameaca.service';
import { RiscoAssociadoService } from 'src/app/services/risco-associado.service';
import { RiscoAssociado } from 'src/app/models/risco-associado/risco-associado';
import { Ameaca } from 'src/app/models/ameaca/ameaca';

@Component({
	selector: 'app-data-map-form',
	templateUrl: './data-map-form.component.html',
	styleUrls: ['./data-map-form.component.css']
})
export class DataMapFormComponent implements OnInit {

	permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

	codDataMap: number;
	codChildrenData: number;
	dataMapForm: FormGroup;
	isLoading = false;
	indTipo: number;

	codCicloMonitoramento: number;

	dataSourcePlanoMitigacao = new MatTableDataSource();
	displayedColumns: string[] = ["desPlanoMitigacao", "actions"];

	listaAtividade: Atividade[];

	listaBaseLegal: BaseLegal[];
	listaBaseLegalFiltrada: Observable<BaseLegal[]>;

	listaCicloVida: CicloDeVida[];
	listaCicloVidaFiltrado: Observable<CicloDeVida[]>;

	listaRisco: Risco[];
	listaRiscosFiltrados: Observable<Risco[]>;

	listaRiscosAssociados: RiscoAssociado[];
	listaRiscosAssociadosFiltrados: Observable<RiscoAssociado[]>;

	listaAmeacas: Ameaca[];
	listaAmeacasFiltradas: Observable<Ameaca[]>;

	listaMetadados: Metadados[];
	metadados: Metadados[];
	listaMetadadosFiltrados: Observable<Metadados[]>;

	separatorKeysCodes: number[] = [ENTER, COMMA];
	metadadosCtrl = new FormControl();
	metadadosDataMap: Metadados[] = [];

	formaColetaSelecionado: FormaColeta[];
	armazenamentoSelecionado: LocalArmazenamento[];
	compartilhamentoSelecionado: Compartilhamento[];

	listaFormaColetas: FormaColeta[];
	listaFormaColetasFiltrados: FormaColeta[];

	listaArmazenamentos: LocalArmazenamento[];
	listaArmazenamentosFiltrados: LocalArmazenamento[];

	listaCompartilhamentos: Compartilhamento[];
	listaCompartilhamentosFiltrados: Compartilhamento[];

	listaEmpresas: Empresa[];
	listaEmpresasFiltradas: Observable<Empresa[]>;

	listaAreas: Area[];
	listaAreasFiltradas: Observable<Area[]>;

	listaProcessos: Processo[];
	listaProcessosFiltradas: Observable<Processo[]>;

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	@ViewChild('metadadosInput', { static: false }) metadadosInput: ElementRef<HTMLInputElement>;

	constructor(
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private snackBar: CustomSnackBarService,
		private router: Router,
		private dialog: MatDialog,
		private dataMapService: DataMapService,
		private metadadosService: MetadadosService,
		private atividadeService: AtividadeService,
		private baseLegalService: BaseLegalService,
		private cicloVidaService: CicloDeVidaService,
		private riscoService: RiscoService,
		private riscoAssociadoService: RiscoAssociadoService,
		private ameacaService: AmeacaService,
		private compartilhamentoService: CompartilhamentoService,
		private formaColetaService: FormaColetaService,
		private localArmazenamentoService: LocalArmazenamentoService,
		private empresaService: EmpresaService,
		private areaService: AreaService,
		private processoService: ProcessoService,
		private cicloMonitoramentoService: CicloMonitoramentoService,
		private planoMitigacaoService: PlanoMitigacaoService,
		private dataFlowService: DataFlowService,
	) { }

	ngOnInit() {

		this.indTipo = 0;

		if (this.router.url.includes('data-analisys-map')) {
			this.indTipo = 1;
		}
		else if (this.router.url.includes('data-governance-map')) {
			this.indTipo = 2;
		}

		this.createForm();
		this.pesquisaDataMap();
	}

	private createForm() {
		this.dataMapForm = this.formBuilder.group({

			codEmpresa: [0, Validators.required],
			empresa: ["", Validators.required],
			dataCompetencia: [""],

			codArea: ["", Validators.required],
			area: ["", Validators.required],

			codProcesso: ["", Validators.required],
			processo: ["", Validators.required],

			codAtividade: ["", Validators.required],
			atividade: ["", Validators.required],

			codBaseLegal: ["", Validators.required],
			baseLegal: ["", Validators.required],

			indPrincipios: [""],
			indSensivel: [""],
			indDadosMenores: [""],

			formaColetas: ["", Validators.required],
			indNecessitaConsentimento: [""],

			armazenamentos: ["", Validators.required],
			indTransfInternacional: [""],

			compartilhamentos: ["", Validators.required],
			indAnonimizacao: [""],

			codCicloVida: ["", Validators.required],
			cicloVida: ["", Validators.required],

			indRisco: ["", Validators.required],
			desObservacoes: [""],

			codigoRisco: [,],
			risco: ["", this.indTipo === 2 ? Validators.required : ""],

			codigoRiscoAssociado: [,],
			riscoAssociado: ["", this.indTipo === 2 ? Validators.required : ""],

			codigoAmeaca: [,],
			ameaca: ["", this.indTipo === 2 ? Validators.required : ""],

			indDescarte: [,],
			indRevisarPermissoes: [,],
			indAnonimizar: [,]

		});


		if (this.indTipo === 2) {
			this.dataMapForm.controls.indPrincipios.disable();
			this.dataMapForm.controls.indSensivel.disable();
			this.dataMapForm.controls.indDadosMenores.disable();
			this.dataMapForm.controls.indAnonimizacao.disable();
			this.dataMapForm.controls.indNecessitaConsentimento.disable();
			this.dataMapForm.controls.indTransfInternacional.disable();
			this.dataMapForm.controls.indRisco.disable();

			this.dataMapForm.controls.armazenamentos.disable();
			this.dataMapForm.controls.formaColetas.disable();
			this.dataMapForm.controls.compartilhamentos.disable();
		}
	}

	pesquisaDataMap() {

		this.activatedRoute.params.subscribe(
			(data) => {
				this.codChildrenData = parseInt(data["childrenId"]);
				this.codDataMap = parseInt(data["id?"]);
				if (this.codDataMap) {
					this.dataMapService.pesquisaDataMap(this.codDataMap).subscribe(
						(retorno) => {

							if (retorno.body[0].indTipo != this.indTipo) {
								if (this.indTipo == 0) {
									this.router.navigate(["/priva/data-map"]);
								}
								else if (this.indTipo == 1) {
									this.router.navigate(["/priva/data-analisys-map"]);
								}
								else {
									this.router.navigate(["/priva/data-governance-map"]);
								}
							}

							this.dataMapForm.patchValue({
								codDataMap: retorno.body[0].codDataMap,

								codEmpresa: retorno.body[0].codEmpresa,
								dataCompetencia: retorno.body[0].dataCompetencia,

								codArea: retorno.body[0].codArea,
								codProcesso: retorno.body[0].codProcesso,
								codAtividade: retorno.body[0].codAtividade,

								codBaseLegal: retorno.body[0].codBaseLegal,

								indPrincipios: retorno.body[0].indPrincipios,
								indSensivel: retorno.body[0].indSensivel,
								indDadosMenores: retorno.body[0].indDadosMenores,

								formaColetas: retorno.body[0].formaColetas,
								indNecessitaConsentimento: retorno.body[0].indNecessitaConsentimento,

								armazenamentos: retorno.body[0].armazenamentos,
								indTransfInternacional: retorno.body[0].indTransfInternacional,

								compartilhamentos: retorno.body[0].compartilhamentos,
								indAnonimizacao: retorno.body[0].indAnonimizacao,

								codCicloVida: retorno.body[0].codCicloVida,
								indRisco: retorno.body[0].indRisco,
								desObservacoes: retorno.body[0].desObservacoes,

								codigoRisco: retorno.body[0].codigoRisco,
								codigoRiscoAssociado: retorno.body[0].codigoRiscoAssociado,
								codigoAmeaca: retorno.body[0].codigoAmeaca,

								indDescarte: retorno.body[0].indDescarte,
								indRevisarPermissoes: retorno.body[0].indRevisarPermissoes,
								indAnonimizar: retorno.body[0].indAnonimizar
							});

							if (retorno.body[0].dataCompetencia) {
								let dataCompetencia = new Date(retorno.body[0].dataCompetencia)
								dataCompetencia.setHours(dataCompetencia.getHours() + 3)
								this.dataMapForm.controls["dataCompetencia"].setValue(dataCompetencia)
							}
							this.metadadosDataMap = retorno.body[0].metadados;

							this.codCicloMonitoramento = retorno.body[0].codCicloMonitoramento;

							this.preencherCombos();

							this.pesquisaArea(retorno.body[0].codEmpresa);
							this.pesquisaProcesso(retorno.body[0].codArea);
							this.pesquisaAtividade(retorno.body[0].codProcesso);
							this.pesquisaPlanoMitigacao(retorno.body[0].codDataMap);
						},
						(err) => {
							if (err.status === 401) {
								TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaDataMap(); }));
							}
							else {
								TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
							}
						}
					);
				} else if (this.codChildrenData) {
					if (this.indTipo == 1) {
						this.dataFlowService.pesquisaDataFlow(this.codChildrenData).subscribe(
							(retorno) => {
								this.dataMapForm.patchValue({
									codDataMap: retorno.body[0].codDataMap,

									codEmpresa: retorno.body[0].codEmpresa,
									dataCompetencia: retorno.body[0].dataCompetencia,

									codArea: retorno.body[0].codArea,
									codProcesso: retorno.body[0].codProcesso,
									codAtividade: retorno.body[0].codAtividade,

									codBaseLegal: retorno.body[0].codBaseLegal,

									indPrincipios: retorno.body[0].indPrincipios,
									indSensivel: retorno.body[0].indSensivel,
									indDadosMenores: retorno.body[0].indDadosMenores,

									formaColetas: retorno.body[0].formaColetas,
									indNecessitaConsentimento: retorno.body[0].indNecessitaConsentimento,

									armazenamentos: retorno.body[0].armazenamentos,
									indTransfInternacional: retorno.body[0].indTransfInternacional,

									compartilhamentos: retorno.body[0].compartilhamentos,
									indAnonimizacao: retorno.body[0].indAnonimizacao,

									codCicloVida: retorno.body[0].codCicloVida,
									indRisco: retorno.body[0].indRisco,
									desObservacoes: retorno.body[0].desObservacoes,

									codigoRisco: retorno.body[0].codigoRisco,
									codigoRiscoAssociado: retorno.body[0].codigoRiscoAssociado,
									codigoAmeaca: retorno.body[0].codigoAmeaca,

									indDescarte: retorno.body[0].indDescarte,
									indRevisarPermissoes: retorno.body[0].indRevisarPermissoes,
									indAnonimizar: retorno.body[0].indAnonimizar
								});

								if (retorno.body[0].dataCompetencia) {
									let dataCompetencia = new Date(retorno.body[0].dataCompetencia)
									dataCompetencia.setHours(dataCompetencia.getHours() + 3)
									this.dataMapForm.controls["dataCompetencia"].setValue(dataCompetencia)
								}
								this.metadadosDataMap = retorno.body[0].metadados;

								this.codCicloMonitoramento = retorno.body[0].codCicloMonitoramento;

								this.preencherCombos();

								this.pesquisaArea(retorno.body[0].codEmpresa);
								this.pesquisaProcesso(retorno.body[0].codArea);
								this.pesquisaAtividade(retorno.body[0].codProcesso);
								this.pesquisaPlanoMitigacao(retorno.body[0].codDataMap ? retorno.body[0].codDataMap : 0);
							},
							(err) => {
								if (err.status === 401) {
									TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaDataMap(); }));
								}
								else {
									TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
								}
							}
						)
					}
					if (this.indTipo == 2) {
						this.dataMapService.pesquisaDataMap(this.codChildrenData).subscribe(
							(retorno) => {
								this.dataMapForm.patchValue({
									codDataMap: retorno.body[0].codDataMap,

									codEmpresa: retorno.body[0].codEmpresa,
									dataCompetencia: retorno.body[0].dataCompetencia,

									codArea: retorno.body[0].codArea,
									codProcesso: retorno.body[0].codProcesso,
									codAtividade: retorno.body[0].codAtividade,

									codBaseLegal: retorno.body[0].codBaseLegal,

									indPrincipios: retorno.body[0].indPrincipios,
									indSensivel: retorno.body[0].indSensivel,
									indDadosMenores: retorno.body[0].indDadosMenores,

									formaColetas: retorno.body[0].formaColetas,
									indNecessitaConsentimento: retorno.body[0].indNecessitaConsentimento,

									armazenamentos: retorno.body[0].armazenamentos,
									indTransfInternacional: retorno.body[0].indTransfInternacional,

									compartilhamentos: retorno.body[0].compartilhamentos,
									indAnonimizacao: retorno.body[0].indAnonimizacao,

									codCicloVida: retorno.body[0].codCicloVida,
									indRisco: retorno.body[0].indRisco,
									desObservacoes: retorno.body[0].desObservacoes,

									codigoRisco: retorno.body[0].codigoRisco,
									codigoRiscoAssociado: retorno.body[0].codigoRiscoAssociado,
									codigoAmeaca: retorno.body[0].codigoAmeaca,

									indDescarte: retorno.body[0].indDescarte,
									indRevisarPermissoes: retorno.body[0].indRevisarPermissoes,
									indAnonimizar: retorno.body[0].indAnonimizar
								});

								if (retorno.body[0].dataCompetencia) {
									let dataCompetencia = new Date(retorno.body[0].dataCompetencia)
									dataCompetencia.setHours(dataCompetencia.getHours() + 3)
									this.dataMapForm.controls["dataCompetencia"].setValue(dataCompetencia)
								}
								this.metadadosDataMap = retorno.body[0].metadados;

								this.codCicloMonitoramento = retorno.body[0].codCicloMonitoramento;

								this.preencherCombos();

								this.pesquisaArea(retorno.body[0].codEmpresa);
								this.pesquisaProcesso(retorno.body[0].codArea);
								this.pesquisaAtividade(retorno.body[0].codProcesso);
								this.pesquisaPlanoMitigacao(retorno.body[0].codDataMap ? retorno.body[0].codDataMap : 0);
							},
							(err) => {
								if (err.status === 401) {
									TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaDataMap(); }));
								}
								else {
									TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
								}
							}
						)
					}
				} else {
					this.preencherCombos();
				}
			}
		)
	}

	preencherCombos() {

		this.pesquisaEmpresas();
		this.pesquisaBaselegal();
		this.pesquisaMetadados();
		this.pesquisaCicloVida();

		this.pesquisaFormaColetas();
		this.pesquisaLocalArmazenamento();
		this.pesquisaCompartilhamentos();

		if (this.indTipo === 2) {
			this.pesquisaRisco();
			this.pesquisaRiscoAssociado();
			this.pesquisaAmeaca();
		}
	}

	salvarDataMap() {

		if (this.dataMapForm.valid) {

			if (this.codCicloMonitoramento == null) {
				TrataExcessaoConexao.TrataExcessao('Não Existem Ciclos de Monitoramento para a Empresa Selecionada!', this.snackBar);
				return;
			}

			if (this.metadadosDataMap.length === 0) {
				this.showMessage("Deve Ser Selecionado ao menos um Metadado", "Warn");
				return;
			}

			const DataMap: DataMap = this.dataMapForm.getRawValue();
			DataMap.codDataMap = this.codDataMap;

			DataMap.indPrincipios = (this.dataMapForm.controls.indPrincipios.value ? 1 : 0);
			DataMap.indSensivel = (this.dataMapForm.controls.indSensivel.value ? 1 : 0);
			DataMap.indDadosMenores = (this.dataMapForm.controls.indDadosMenores.value ? 1 : 0);

			DataMap.indNecessitaConsentimento = (this.dataMapForm.controls.indNecessitaConsentimento.value ? 1 : 0);
			DataMap.indTransfInternacional = (this.dataMapForm.controls.indTransfInternacional.value ? 1 : 0);
			DataMap.indAnonimizacao = (this.dataMapForm.controls.indAnonimizacao.value ? 1 : 0);

			DataMap.indRisco = parseInt(this.dataMapForm.controls.indRisco.value);
			DataMap.indTipo = this.indTipo;
			DataMap.codCicloMonitoramento = this.codCicloMonitoramento;
			DataMap.metadados = this.metadadosDataMap;

			if (this.indTipo === 2) {
				DataMap.indDescarte = (this.dataMapForm.controls.indDescarte.value ? 1 : 0);
				DataMap.indRevisarPermissoes = (this.dataMapForm.controls.indRevisarPermissoes.value ? 1 : 0);
				DataMap.indAnonimizar = (this.dataMapForm.controls.indAnonimizar.value ? 1 : 0);
			}

			if (this.codDataMap) {
				// Alteração
				this.dataMapService.alterarDataMap(DataMap).subscribe(
					(response) => {
						if (this.indTipo == 1) {
							this.snackBar.openSnackBar(`Data Analisys Map Alterado com Sucesso`, null);
							this.router.navigate(["/priva/data-analisys-map"]);
						}
						else if (this.indTipo == 2) {
							this.snackBar.openSnackBar(`Data Governance Map Alterado com Sucesso`, null);
							this.router.navigate(["/priva/data-governance-map"]);
						}
						else {
							this.snackBar.openSnackBar(`Data Map Alterado com Sucesso`, null);
							this.router.navigate(["/priva/data-map"]);
						}
					},
					(err) => {
						if (err.status === 401) {
							TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.salvarDataMap(); }));
						}
						else {
							TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
						}
					}
				)
			} else {
				// Inclusão
				this.dataMapService.incluirDataMap(DataMap).subscribe(
					(response) => {
						if (this.indTipo == 1) {
							this.snackBar.openSnackBar(`Data Analisys Map Criado com Sucesso`, null);
							this.router.navigate(["/priva/data-analisys-map"]);
						}
						else if (this.indTipo == 2) {
							this.snackBar.openSnackBar(`Data Governance Map Criado com Sucesso`, null);
							this.router.navigate(["/priva/data-governance-map"]);
						}
						else {
							this.snackBar.openSnackBar(`Data  Map Criado com Sucesso`, null);
							this.router.navigate(["/priva/data-map"]);
						}
					},
					(err) => {
						if (err.status === 401) {
							TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.salvarDataMap(); }));
						}
						else {
							TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
						}
					}
				)
			}
		} else {
			this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
		}
	}

	displayMetadados(metadados: Metadados): string {
		return metadados ? metadados.nomeMetadados : "";
	}

	remove(metadados: Metadados): void {
		const index = this.metadadosDataMap.indexOf(metadados);

		if (index >= 0) {
			this.metadadosDataMap.splice(index, 1);
			this.listaMetadados.push(metadados);
		}

		this.listaMetadados.sort((a, b) => a.nomeMetadados.localeCompare(b.nomeMetadados));

		this.metadadosCtrl.setValue("");
	}

	selectedMetadados(event: MatAutocompleteSelectedEvent): void {

		var metadadosSelected: Metadados;
		metadadosSelected = event.option.value;
		this.metadadosDataMap.push(metadadosSelected);

		this.metadadosInput.nativeElement.value = '';
		const index = this.listaMetadados.indexOf(metadadosSelected);

		if (index >= 0) {
			this.listaMetadados.splice(index, 1);
		}
		this.metadadosCtrl.setValue("");

		if (metadadosSelected.indSensivel == 1) {
			this.dataMapForm.controls.indSensivel.setValue(1);
		}
	}

	private pesquisaMetadados() {
		this.metadadosService.listaTodosMetadados().subscribe(
			(retorno) => {
				this.listaMetadados = retorno.body;

				this.removeSelecionados();

				this.listaMetadadosFiltrados = this.metadadosCtrl.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeMetadados),
						map(name => {
							return name ? this.filtraMetadados(name) : this.listaMetadados.slice();
						}));

				this.isLoading = false;

			});

		this.isLoading = false;
	}

	//Remove os Metadados já selecionados da lista de todos os Metadados Cadastrados
	removeSelecionados() {
		var index = -1;
		if (this.listaMetadados != undefined && this.listaMetadados.length != 0 &&
			this.metadadosDataMap != undefined && this.metadadosDataMap.length != 0) {
			var listaAux = this.listaMetadados;
			this.listaMetadados = [];
			listaAux.forEach(meta => {
				index = -1;
				this.metadadosDataMap.forEach(metaDataMap => {
					if (meta.codMetadados === metaDataMap.codMetadados) {
						index = 1;
					}
				});

				if (index === -1) {
					this.listaMetadados.push(meta);
				}
			});
			this.listaMetadados.sort((a, b) => a.nomeMetadados.localeCompare(b.nomeMetadados));

			this.metadadosCtrl.setValue("");
		}
	}

	filtraMetadados(value: string): Metadados[] {
		const filterValue = value.toLowerCase();
		return this.listaMetadados.filter(item => item.nomeMetadados.trim().toLowerCase().includes(filterValue));
	}

	private pesquisaAtividade(codProcesso: number) {
		this.isLoading = true;
		this.atividadeService.listaAtivadadesPorProcesso(codProcesso).subscribe(
			(retorno) => {
				this.isLoading = false;
				this.listaAtividade = retorno.body;

				if (this.dataMapForm.controls.codAtividade.value != 0) {
					let atividade: Atividade = <Atividade>this.listaAtividade.filter(atividade => atividade.codAtividade == this.dataMapForm.controls.codAtividade.value)[0];
					if (atividade) {
						this.dataMapForm.controls.atividade.setValue(atividade);
					}
				}
			}
		)
	}

	displayAtividade(atividade: Atividade): string {
		return atividade ? atividade.nomeAtividade : "";
	}

	selecionaAtividade(event) {
		let selecionado: Atividade = event.option.value;
		this.dataMapForm.controls.atividade.setValue(selecionado);
		this.dataMapForm.controls.codAtividade.setValue(selecionado.codAtividade);

		if (!this.codDataMap) {
			this.isLoading = true;
			if (this.indTipo == 1) {
				//Se for Data Analisys Map, buscar informações do Data Map
				this.dataMapService.pesquisaDataMapCicloAtividadeTipo(this.codCicloMonitoramento, selecionado.codAtividade, 0).subscribe(
					(retorno) => {

						if (retorno.body[0]) {
							this.metadadosDataMap = retorno.body[0].metadados;

							let baseLegal: BaseLegal = <BaseLegal>this.listaBaseLegal.filter(baseLegal => baseLegal.codigoBase == retorno.body[0].codBaseLegal)[0];
							if (baseLegal) {
								this.dataMapForm.controls.baseLegal.setValue(baseLegal);
								this.dataMapForm.controls.codBaseLegal.setValue(baseLegal.codigoBase);
							}

							this.dataMapForm.controls.indPrincipios.setValue(retorno.body[0].indPrincipios);
							this.dataMapForm.controls.indSensivel.setValue(retorno.body[0].indSensivel);
							this.dataMapForm.controls.indDadosMenores.setValue(retorno.body[0].indDadosMenores);
							this.dataMapForm.controls.formaColetas.setValue(retorno.body[0].formaColetas);
							this.dataMapForm.controls.indNecessitaConsentimento.setValue(retorno.body[0].indNecessitaConsentimento);
							this.dataMapForm.controls.armazenamentos.setValue(retorno.body[0].armazenamentos);
							this.dataMapForm.controls.indTransfInternacional.setValue(retorno.body[0].indTransfInternacional);
							this.dataMapForm.controls.compartilhamentos.setValue(retorno.body[0].compartilhamentos);
							this.dataMapForm.controls.indAnonimizacao.setValue(retorno.body[0].indAnonimizacao);

							let cicloVida: CicloDeVida = <CicloDeVida>this.listaCicloVida.filter(cicloVida => cicloVida.codCicloVida == retorno.body[0].codCicloVida)[0];
							if (cicloVida) {
								this.dataMapForm.controls.cicloVida.setValue(cicloVida);
								this.dataMapForm.controls.codCicloVida.setValue(cicloVida.codCicloVida);
							}

							this.dataMapForm.controls.indRisco.setValue(retorno.body[0].indRisco);

							this.dataMapForm.controls.desObservacoes.setValue(retorno.body[0].desObservacoes);
						}

						this.isLoading = false;
					});
			}
			else if (this.indTipo == 2) {
				//Se for Data Governance Map, buscar informações do Data Analisys Map
				this.dataMapService.pesquisaDataMapCicloAtividadeTipo(this.codCicloMonitoramento, selecionado.codAtividade, 1).subscribe(
					(retorno) => {

						if (retorno.body[0]) {
							this.metadadosDataMap = retorno.body[0].metadados;

							let baseLegal: BaseLegal = <BaseLegal>this.listaBaseLegal.filter(baseLegal => baseLegal.codigoBase == retorno.body[0].codBaseLegal)[0];
							if (baseLegal) {
								this.dataMapForm.controls.baseLegal.setValue(baseLegal);
								this.dataMapForm.controls.codBaseLegal.setValue(baseLegal.codigoBase);
							}

							this.dataMapForm.controls.indPrincipios.setValue(retorno.body[0].indPrincipios);
							this.dataMapForm.controls.indSensivel.setValue(retorno.body[0].indSensivel);
							this.dataMapForm.controls.indDadosMenores.setValue(retorno.body[0].indDadosMenores);
							this.dataMapForm.controls.formaColetas.setValue(retorno.body[0].formaColetas);
							this.dataMapForm.controls.indNecessitaConsentimento.setValue(retorno.body[0].indNecessitaConsentimento);
							this.dataMapForm.controls.armazenamentos.setValue(retorno.body[0].armazenamentos);
							this.dataMapForm.controls.indTransfInternacional.setValue(retorno.body[0].indTransfInternacional);
							this.dataMapForm.controls.compartilhamentos.setValue(retorno.body[0].compartilhamentos);
							this.dataMapForm.controls.indAnonimizacao.setValue(retorno.body[0].indAnonimizacao);

							let cicloVida: CicloDeVida = <CicloDeVida>this.listaCicloVida.filter(cicloVida => cicloVida.codCicloVida == retorno.body[0].codCicloVida)[0];
							if (cicloVida) {
								this.dataMapForm.controls.cicloVida.setValue(cicloVida);
								this.dataMapForm.controls.codCicloVida.setValue(cicloVida.codCicloVida);
							}

							this.dataMapForm.controls.indRisco.setValue(retorno.body[0].indRisco);
							this.dataMapForm.controls.desObservacoes.setValue(retorno.body[0].desObservacoes);
						}

						this.isLoading = false;
					});
			}
			else {
				//Se for Data map, buscar informações do Data Flow

				this.dataFlowService.pesquisaDataFlowCicloAtividade(this.codCicloMonitoramento, selecionado.codAtividade).subscribe(
					(retorno) => {

						if (retorno.body[0]) {

							let cicloVida: CicloDeVida = <CicloDeVida>this.listaCicloVida.filter(cicloVida => cicloVida.codCicloVida == retorno.body[0].codCicloVida)[0];
							if (cicloVida) {
								this.dataMapForm.controls.cicloVida.setValue(cicloVida);
								this.dataMapForm.controls.codCicloVida.setValue(cicloVida.codCicloVida);
							}

							this.dataMapForm.controls.indRisco.setValue(retorno.body[0].indRisco);
							this.dataMapForm.controls.compartilhamentos.setValue(retorno.body[0].compartilhamentos);
							this.dataMapForm.controls.armazenamentos.setValue(retorno.body[0].armazenamentos);
							this.metadadosDataMap = retorno.body[0].metadados;
							this.dataMapForm.controls.formaColetas.setValue(retorno.body[0].formaColetas);
							this.removeSelecionados();
							this.testaMetadadosSensiveis();

						}

						this.isLoading = false;

					});
			}
		}
		else {

			this.metadadosDataMap = selecionado.metadados;
			this.testaMetadadosSensiveis();
			this.removeSelecionados();
		}
	}

	private testaMetadadosSensiveis() {
		this.metadadosDataMap.forEach(metadados => {
			if (metadados.indSensivel === 1) {
				this.dataMapForm.controls.indSensivel.setValue(1);
			}
		});
	}

	private pesquisaBaselegal() {
		this.baseLegalService.listaTodasBasesLegais().subscribe(
			(retorno) => {
				this.listaBaseLegal = retorno.body;

				if (this.dataMapForm.controls.codBaseLegal.value != 0) {
					let baseLegal: BaseLegal = <BaseLegal>this.listaBaseLegal.filter(baseLegal => baseLegal.codigoBase == this.dataMapForm.controls.codBaseLegal.value)[0];
					if (baseLegal) {
						this.dataMapForm.controls.baseLegal.setValue(baseLegal);
					}
				}
			}
		)
		this.isLoading = false;
	}

	selecionaBaseLegal(event) {
		let selecionado: BaseLegal = event.option.value;
		this.dataMapForm.controls.baseLegal.setValue(selecionado);
		this.dataMapForm.controls.codBaseLegal.setValue(selecionado.codigoBase);
	}

	displayBaseLegal(baseLegal: BaseLegal): string {
		return baseLegal ? baseLegal.nomeBase : "";
	}

	private pesquisaFormaColetas() {
		this.formaColetaService.listaTodasFormaColeta().subscribe(
			(retorno) => {
				this.listaFormaColetasFiltrados = retorno.body;

			}
		)
		this.isLoading = false;
	}

	compareFormaColeta(o1: any, o2: any): boolean {
		if (o2 != null)
			return o1.codFormaColeta === o2.codFormaColeta;
	}

	private pesquisaLocalArmazenamento() {
		this.localArmazenamentoService.listaTodosLocaisArmazenamento().subscribe(
			(retorno) => {
				this.listaArmazenamentosFiltrados = retorno.body;
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
			}
		)
		this.isLoading = false;
	}

	compareCompartilhamento(o1: any, o2: any): boolean {
		if (o2 != null)
			return o1.codCompartilhamento === o2.codCompartilhamento;
	}

	private pesquisaCicloVida() {
		this.cicloVidaService.listaTodosCiclosDeVida().subscribe(
			(retorno) => {
				this.listaCicloVida = retorno.body;

				if (this.dataMapForm.controls.codCicloVida.value != 0) {
					let cicloVida: CicloDeVida = <CicloDeVida>this.listaCicloVida.filter(cicloVida => cicloVida.codCicloVida == this.dataMapForm.controls.codCicloVida.value)[0];
					if (cicloVida) {
						this.dataMapForm.controls.cicloVida.setValue(cicloVida);
					}
				}
			}
		)
		this.isLoading = false;
	}

	selecionaCicloVida(event) {
		let selecionado: CicloDeVida = event.option.value;
		this.dataMapForm.controls.cicloVida.setValue(selecionado);
		this.dataMapForm.controls.codCicloVida.setValue(selecionado.codCicloVida);
	}

	displayCicloVida(cicloVida: CicloDeVida): string {
		return cicloVida ? cicloVida.nomeCicloVida : "";
	}

	private pesquisaRisco() {
		this.riscoService.listaTodos().subscribe(
			(retorno) => {
				this.listaRisco = retorno.body;

				if (this.dataMapForm.controls.codigoRisco.value != 0) {
					let risco: Risco = <Risco>this.listaRisco.filter(risco => risco.codigoRisco == this.dataMapForm.controls.codigoRisco.value)[0];
					if (risco) {
						this.dataMapForm.controls.risco.setValue(risco);
					}
				}

				this.listaRiscosFiltrados = this.dataMapForm.controls.risco.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeRisco),
						map(name => {
							return name ? this.filtraRisco(name) : this.listaRisco.slice();
						}));

				this.isLoading = false;
			}
		)
	}

	private filtraRisco(value: string): Risco[] {
		const filterValue = value.toLowerCase();
		return this.listaRisco.filter(item => item.nomeRisco.trim().toLowerCase().includes(filterValue));
	}

	selecionaRisco(event) {
		let selecionado: Risco = event.option.value;
		this.dataMapForm.controls.risco.setValue(selecionado);
		this.dataMapForm.controls.codigoRisco.setValue(selecionado.codigoRisco);
	}

	displayRisco(risco: Risco): string {
		return risco ? risco.nomeRisco : "";
	}

	private pesquisaRiscoAssociado() {
		this.riscoAssociadoService.listaTodosRiscoAssociado().subscribe(
			(retorno) => {
				this.listaRiscosAssociados = retorno.body;

				if (this.dataMapForm.controls.codigoRiscoAssociado.value != 0) {
					let riscoAssociado: RiscoAssociado = <RiscoAssociado>this.listaRiscosAssociados.filter(riscoAssociado => riscoAssociado.codigoRiscoAssociado == this.dataMapForm.controls.codigoRiscoAssociado.value)[0];
					if (riscoAssociado) {
						this.dataMapForm.controls.riscoAssociado.setValue(riscoAssociado);
					}
				}

				this.listaRiscosAssociadosFiltrados = this.dataMapForm.controls.riscoAssociado.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeRiscoAssociado),
						map(name => {
							return name ? this.filtraRiscoAssociado(name) : this.listaRiscosAssociados.slice();
						}));

				this.isLoading = false;
			}
		)
	}

	private filtraRiscoAssociado(value: string): RiscoAssociado[] {
		const filterValue = value.toLowerCase();
		return this.listaRiscosAssociados.filter(item => item.nomeRiscoAssociado.trim().toLowerCase().includes(filterValue));
	}

	selecionaRiscoAssociado(event) {
		let selecionado: RiscoAssociado = event.option.value;
		this.dataMapForm.controls.riscoAssociado.setValue(selecionado);
		this.dataMapForm.controls.codigoRiscoAssociado.setValue(selecionado.codigoRiscoAssociado);
	}

	displayRiscoAssociado(riscoAssociado: RiscoAssociado): string {
		return riscoAssociado ? riscoAssociado.nomeRiscoAssociado : "";
	}

	private pesquisaAmeaca() {
		this.ameacaService.listaTodosAmeaca().subscribe(
			(retorno) => {
				this.listaAmeacas = retorno.body;

				if (this.dataMapForm.controls.codigoAmeaca.value != 0) {
					let ameaca: Ameaca = <Ameaca>this.listaAmeacas.filter(ameaca => ameaca.codigoAmeaca == this.dataMapForm.controls.codigoAmeaca.value)[0];
					if (ameaca) {
						this.dataMapForm.controls.ameaca.setValue(ameaca);
					}
				}

				this.listaAmeacasFiltradas = this.dataMapForm.controls.ameaca.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeAmeaca),
						map(name => {
							return name ? this.filtraAmeaca(name) : this.listaAmeacas.slice();
						}));

				this.isLoading = false;
			}
		)
	}

	private filtraAmeaca(value: string): Ameaca[] {
		const filterValue = value.toLowerCase();
		return this.listaAmeacas.filter(item => item.nomeAmeaca.trim().toLowerCase().includes(filterValue));
	}

	selecionaAmeaca(event) {
		let selecionado: Ameaca = event.option.value;
		this.dataMapForm.controls.ameaca.setValue(selecionado);
		this.dataMapForm.controls.codigoAmeaca.setValue(selecionado.codigoAmeaca);
	}

	displayAmeaca(ameaca: Ameaca): string {
		return ameaca ? ameaca.nomeAmeaca : "";
	}

	private pesquisaEmpresas() {
		this.empresaService.listaTodasEmpresas().subscribe(
			(retorno) => {
				this.listaEmpresas = retorno.body;

				let codEmpresa = this.dataMapForm.controls.codEmpresa.value;
				if (codEmpresa != 0) {
					let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
					if (empresaSel)
						this.dataMapForm.controls.empresa.setValue(empresaSel);
				}

				this.listaEmpresasFiltradas = this.dataMapForm.controls.empresa.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeEmpresa),
						map(name => {
							return name ? this.filtraEmpresa(name) : this.listaEmpresas.slice();
						}));
			}
		)
	}

	private filtraEmpresa(value: string): Empresa[] {
		const filterValue = value.toLowerCase();
		return this.listaEmpresas.filter(item => item.nomeEmpresa.trim().toLowerCase().includes(filterValue));
	}

	selecionaEmpresa(event) {
		let empresaSelecionada: Empresa = event.option.value;
		this.dataMapForm.controls.empresa.setValue(empresaSelecionada);
		this.dataMapForm.controls.codEmpresa.setValue(empresaSelecionada.codigoEmpresa);

		this.dataMapForm.controls.area.setValue(null);
		this.dataMapForm.controls.codProcesso.setValue(null);
		this.dataMapForm.controls.processo.setValue(null);
		this.dataMapForm.controls.codAtividade.setValue(null);
		this.dataMapForm.controls.atividade.setValue(null);

		this.isLoading = true;

		this.buscarUltimoCicloMonitoramento(empresaSelecionada.codigoEmpresa);

		this.pesquisaArea(empresaSelecionada.codigoEmpresa);
	}

	displayEmpresa(empresa: Empresa): string {
		return empresa ? empresa.nomeEmpresa : "";
	}

	private buscarUltimoCicloMonitoramento(codigoEmpresa: number) {
		this.isLoading = true;
		this.cicloMonitoramentoService.buscarUltimoCicloMonitoramento(codigoEmpresa).subscribe(
			(retorno) => {
				this.isLoading = false;
				if (retorno.body != null) {
					this.codCicloMonitoramento = retorno.body.codCicloMonitoramento;
					let dataCompetencia = new Date(retorno.body.dataCompetencia)
					dataCompetencia.setHours(dataCompetencia.getHours() + 3)
					this.dataMapForm.controls["dataCompetencia"].setValue(dataCompetencia)
				} else {
					this.codCicloMonitoramento = null;
					TrataExcessaoConexao.TrataExcessao('Não existem ciclos de monitoramento para a empresa selecionada!', this.snackBar);
				}
			}
		)
	}

	private pesquisaArea(codEmpresa: number) {
		this.areaService.listaAreasPorEmpresa(codEmpresa).subscribe(
			(retorno) => {
				this.listaAreas = retorno.body;

				let codArea = this.dataMapForm.controls.codArea.value;
				if (codArea != 0) {
					let areaSel: Area = <Area>this.listaAreas.filter(area => area.codArea == codArea)[0];
					if (areaSel)
						this.dataMapForm.controls.area.setValue(areaSel);
				}

				this.listaAreasFiltradas = this.dataMapForm.controls.area.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "" : value),
						map(value => typeof value === 'string' ? value : value.nomeArea),
						map(name => {
							return name ? this.filtraArea(name) : this.listaAreas.slice();
						}));
			}
		)
	}

	private filtraArea(value: string): Area[] {
		const filterValue = value.toLowerCase();
		return this.listaAreas.filter(item => item.nomeArea.trim().toLowerCase().includes(filterValue));
	}

	selecionaArea(event) {
		let areaSelecionada: Area = event.option.value;
		this.dataMapForm.controls.area.setValue(areaSelecionada);
		this.dataMapForm.controls.codArea.setValue(areaSelecionada.codArea);

		this.dataMapForm.controls.codProcesso.setValue(null);
		this.dataMapForm.controls.processo.setValue(null);
		this.dataMapForm.controls.codAtividade.setValue(null);
		this.dataMapForm.controls.atividade.setValue(null);

		this.pesquisaProcesso(areaSelecionada.codArea);
	}

	displayArea(area: Area): string {
		return area ? area.nomeArea : "";
	}

	private pesquisaProcesso(codArea: number) {
		this.isLoading = true;
		this.processoService.listarProcessosPorArea(codArea).subscribe(
			(retorno) => {
				this.isLoading = false;
				this.listaProcessos = retorno.body;

				let codProcesso = this.dataMapForm.controls.codProcesso.value;
				if (codProcesso != 0) {
					let processoSel: Processo = <Processo>this.listaProcessos.filter(processo => processo.codProcesso == codProcesso)[0];
					if (processoSel)
						this.dataMapForm.controls.processo.setValue(processoSel);
				}

				this.listaProcessosFiltradas = this.dataMapForm.controls.processo.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "" : value),
						map(value => typeof value === 'string' ? value : value.nomeProcesso),
						map(name => {
							return name ? this.filtraProcesso(name) : this.listaProcessos.slice();
						}));
			}
		)
	}

	private filtraProcesso(value: string): Processo[] {
		const filterValue = value.toLowerCase();
		return this.listaProcessos.filter(item => item.nomeProcesso.trim().toLowerCase().includes(filterValue));
	}

	selecionaProcesso(event) {
		let processoSelecionada: Processo = event.option.value;
		this.dataMapForm.controls.processo.setValue(processoSelecionada);
		this.dataMapForm.controls.codProcesso.setValue(processoSelecionada.codProcesso);

		this.dataMapForm.controls.codAtividade.setValue(null);
		this.dataMapForm.controls.atividade.setValue(null);

		this.pesquisaAtividade(processoSelecionada.codProcesso);
	}

	displayProcesso(processo: Processo): string {
		return processo ? processo.nomeProcesso : "";
	}

	closeDatePicker(eventData: any, picker: any) {
		this.dataMapForm.controls.dataCompetencia.setValue(eventData);
		picker.close();
	}

	applyFilterPlanoMitigacao(value: string) {
		this.dataSourcePlanoMitigacao.filter = value.trim().toLowerCase();
	}

	pesquisaPlanoMitigacao(codDataMap: number) {
		this.planoMitigacaoService.listaTodosPlanoMitigacao(codDataMap).subscribe(
			(response) => {
				this.dataSourcePlanoMitigacao = new MatTableDataSource<PlanoMitigacao>(response.body);
				setTimeout(() => {
					this.dataSourcePlanoMitigacao.filterPredicate = (
						data: {
							desPlanoMitigacao: string,
						},
						filterValue: string
					) => data.desPlanoMitigacao.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

					this.dataSourcePlanoMitigacao.paginator = this.paginator;
					this.dataSourcePlanoMitigacao.sort = this.sort;
				})
				this.isLoading = false;
			}
		)
	}

	excluirPlano(planoMitigacao: PlanoMitigacao) {
		const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
			data: {
				title: "Confirmar Exclusão do Plano de Mitigação",
				msg: `Tem certeza que deseja prosseguir com exclusão do Plano de Mitigação ${planoMitigacao.desPlanoMitigacao}?`,
			},
		});

		confirmRemoveDialog.afterClosed().subscribe((result) => {
			if (result) {
				this.confirmaExclusaoPlano(planoMitigacao);
				this.isLoading = true;
			}
		});
	}

	confirmaExclusaoPlano(planoMitigacao: PlanoMitigacao) {
		this.planoMitigacaoService.excluirPlanoMitigacao(planoMitigacao.codPlanoMitigacao).subscribe((response) => {
			this.snackBar.openSnackBar(
				`Plano de Mitigação ${planoMitigacao.desPlanoMitigacao} foi excluído com Sucesso.`,
				null
			);
			this.pesquisaPlanoMitigacao(this.codDataMap);
		},
			(err) => {
				if (err.status === 401) {
					TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.confirmaExclusaoPlano(planoMitigacao); }));
				}
				else {
					TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
					this.isLoading = false;
				}
			});
	}

	calculaRisco() {
		var indRisco: number = 0;

		if (this.dataMapForm.controls.indSensivel.value == 1) {
			indRisco++;
		}

		if (this.dataMapForm.controls.indDadosMenores.value == 1) {
			indRisco++;
		}

		if (this.dataMapForm.controls.indNecessitaConsentimento.value == 1) {
			indRisco++;
		}

		if (this.dataMapForm.controls.indTransfInternacional.value == 1) {
			indRisco++;
		}

		if (this.dataMapForm.controls.indAnonimizacao.value == 1) {
			indRisco++;
		}

		if (indRisco === 0) {
			indRisco = 1;
		}

		if (indRisco > 4) {
			indRisco = 4;
		}

		this.dataMapForm.controls.indRisco.setValue(indRisco);

	}

	private showMessage(msg: string, type: string = "Success") {
		this.snackBar.openSnackBar(msg, null, type);
	}

}
