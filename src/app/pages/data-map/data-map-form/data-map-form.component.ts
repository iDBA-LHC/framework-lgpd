import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
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
import { ProcessoService } from 'src/app/services/processo.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { Atividade } from './../../../models/atividade/atividade';
import { AtividadeService } from './../../../services/atividade.service';

@Component({
	selector: 'app-data-map-form',
	templateUrl: './data-map-form.component.html',
	styleUrls: ['./data-map-form.component.css']
})
export class DataMapFormComponent implements OnInit {

	dataMapForm: FormGroup;
	codDataMap: number;
	isLoading = false;

	listaAtividade: Atividade[];
	listaBaseLegal: BaseLegal[];
	listaMetadados: Metadados[];
	listaCicloVida: CicloDeVida[];

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
		private compartilhamentoService: CompartilhamentoService,
		private formaColetaService: FormaColetaService,
		private localArmazenamentoService: LocalArmazenamentoService,
		private empresaService: EmpresaService,
		private areaService: AreaService,
		private processoService: ProcessoService,
		private cicloMonitoramentoService: CicloMonitoramentoService
	) { }

	ngOnInit() {
		//this.isLoading = true;

		this.createForm();
		this.pesquisaDataMap();
	}

	private createForm() {
		this.dataMapForm = this.formBuilder.group({

			codEmpresa: [0, Validators.required],
			empresa: ["", Validators.required],
			codCicloMonitoramento: ["", Validators.required],
			codArea: ["", Validators.required],
			area: ["", Validators.required],

			codProcesso: ["", Validators.required],
			processo: ["", Validators.required],

			codAtividade: ["", Validators.required],
			atividade: ["", Validators.required],

			codMetadados: ["", Validators.required],
			metadados: ["", Validators.required],

			codBaseLegal: ["", Validators.required],
			baseLegal: ["", Validators.required],

			indPrincipios: ["", Validators.required],
			indSensivel: ["", Validators.required],
			indDadosMenores: ["", Validators.required],

			formaColetas: ["", Validators.required],
			indNecessitaConsentimento: ["", Validators.required],

			armazenamentos: ["", Validators.required],
			indTransfInternacional: ["", Validators.required],

			compartilhamentos: ["", Validators.required],
			indAnonimizacao: ["", Validators.required],

			cicloVida: ["", Validators.required],
			codCicloVida: ["", Validators.required],
			indRisco: ["", Validators.required],
			desObservacoes: [""]

		});
	}

	pesquisaDataMap() {
		this.activatedRoute.params.subscribe(
			(data) => {
				this.codDataMap = parseInt(data["id?"]);

				if (this.codDataMap) {
					this.dataMapService.pesquisaDataMap(this.codDataMap).subscribe(
						(retorno) => {
							this.dataMapForm.patchValue({
								codDataMap: retorno.body[0].codDataMap,
								codCicloMonitoramento: retorno.body[0].codCicloMonitoramento,

								codEmpresa: retorno.body[0].codEmpresa,
								codArea: retorno.body[0].codArea,
								codProcesso: retorno.body[0].codProcesso,
								codAtividade: retorno.body[0].codAtividade,
								codMetadados: retorno.body[0].codMetadados,

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
								desObservacoes: retorno.body[0].desObservacoes
							});

							this.preencherCombos();
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
				} else {
					this.preencherCombos();
				}
			}
		)
	}

	preencherCombos() {

		this.pesquisaBaselegal();
		this.pesquisaMetadados();
		this.pesquisaCicloVida();
		this.pesquisaFormaColetas();
		this.pesquisaLocalArmazenamento();
		this.pesquisaCompartilhamentos();
		this.pesquisaEmpresas();
		this.pesquisaArea();
	}

	salvarDataMap() {

		const DataMap: DataMap = this.dataMapForm.getRawValue();

		//if (this.dataMapForm.valid) {

		DataMap.codDataMap = this.codDataMap;
		DataMap.codCicloMonitoramento = this.codCicloMonitoramento;

		DataMap.indPrincipios = (this.dataMapForm.controls.indPrincipios.value ? 1 : 0);
		DataMap.indSensivel = (this.dataMapForm.controls.indSensivel.value ? 1 : 0);
		DataMap.indDadosMenores = (this.dataMapForm.controls.indDadosMenores.value ? 1 : 0);

		DataMap.indNecessitaConsentimento = (this.dataMapForm.controls.indNecessitaConsentimento.value ? 1 : 0);
		DataMap.indTransfInternacional = (this.dataMapForm.controls.indTransfInternacional.value ? 1 : 0);
		DataMap.indAnonimizacao = (this.dataMapForm.controls.indAnonimizacao.value ? 1 : 0);

		DataMap.indRisco = parseInt(this.dataMapForm.controls.indRisco.value);
		DataMap.indTipo = 0;

		if (this.codDataMap) {
			// Alteração
			this.dataMapService.alterarDataMap(DataMap).subscribe(
				(response) => {
					this.snackBar.openSnackBar(`O Data Map foi atualizado com sucesso!`, null);
					this.router.navigate(["/data-map"]);
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
					this.snackBar.openSnackBar(`O Data Map foi criado com sucesso!`, null);
					this.router.navigate(["/data-map"]);
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
		//}
	}

	private pesquisaMetadados() {
		this.metadadosService.listaTodosMetadados().subscribe(
			(retorno) => {
				this.listaMetadados = retorno.body;

				if (this.dataMapForm.controls.codMetadados.value != 0) {
					let metadados: Metadados = <Metadados>this.listaMetadados.filter(metadados => metadados.codMetadados == this.dataMapForm.controls.codMetadados.value)[0];
					if (metadados) {
						this.dataMapForm.controls.metadados.setValue(metadados);
					}
				}
			}
		)
		this.isLoading = false;
	}

	selecionaMetadados(event) {
		let selecionado: Metadados = event.option.value;
		this.dataMapForm.controls.metadados.setValue(selecionado);
		this.dataMapForm.controls.codMetadados.setValue(selecionado.codMetadados);
	}

	compareMetadados(o1: any, o2: any): boolean {
		if (o2 != null)
			return o1.codMetadados === o2.codMetadados;
	}

	displayMetadados(metadados: Metadados): string {
		return metadados ? metadados.nomeMetadados : "";
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

	compareBaseLegal(o1: any, o2: any): boolean {
		if (o2 != null)
			return o1.codBaseLegal === o2.codBaseLegal;
	}

	displayBaseLegal(baseLegal: BaseLegal): string {
		return baseLegal ? baseLegal.nomeBase : "";
	}

	private pesquisaFormaColetas() {
		this.formaColetaService.listaTodasFormaColeta().subscribe(
			(retorno) => {
				this.listaFormaColetasFiltrados = retorno.body;

				//let codigoEmpresa = this.dataMapForm.controls.codigoEmpresa.value;
				//this.listaFormaColetasFiltrados = <FormaColeta []>this.listaFormaColetas.filter(model => model.codigoEmpresa == codigoEmpresa);
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

	compareCicloVida(o1: any, o2: any): boolean {
		if (o2 != null)
			return o1.codCicloVida === o2.codCicloVida;
	}

	displayCicloVida(cicloVida: CicloDeVida): string {
		return cicloVida ? cicloVida.nomeCicloVida : "";
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

		this.isLoading = true;

		this.buscarUltimoCicloMonitoramento(empresaSelecionada.codigoEmpresa);
	}

	displayEmpresa(empresa: Empresa): string {
		return empresa ? empresa.nomeEmpresa : "";
	}

	private buscarUltimoCicloMonitoramento(codigoEmpresa: number) {
		this.cicloMonitoramentoService.buscarUltimoCicloMonitoramento(codigoEmpresa).subscribe(
			(retorno) => {
				if (retorno.body != null) {
					this.dataMapForm.controls.codCicloMonitoramento.setValue(retorno.body.codCicloMonitoramento);
				} else {
					this.dataMapForm.controls.codCicloMonitoramento.setValue(null);
					TrataExcessaoConexao.TrataExcessao('Não existem ciclos de monitoramento para a empresa selecionada!', this.snackBar);
				}
			}
		)
		this.isLoading = false;
	}

	private pesquisaArea() {
		this.areaService.listaTodasAreas().subscribe(
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

		this.pesquisaAtividade(processoSelecionada.codProcesso);
	}

	displayProcesso(processo: Processo): string {
		return processo ? processo.nomeProcesso : "";
	}
}
