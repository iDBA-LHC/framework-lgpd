import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { BaseLegal } from 'src/app/models/base-legal/base-legal';
import { CicloDeVida } from 'src/app/models/ciclo-de-vida/ciclo-de-vida';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { DataMap } from 'src/app/models/data-map/data-map';
import { FormaColeta } from 'src/app/models/forma-coleta/forma-coleta';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { Metadados } from 'src/app/models/metadados/metadados';
import { AuthService } from 'src/app/services/auth.service';
import { BaseLegalService } from 'src/app/services/base-legal.service';
import { CicloDeVidaService } from 'src/app/services/ciclo-de-vida.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { FormaColetaService } from 'src/app/services/forma-coleta.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
	selector: 'app-data-map-form',
	templateUrl: './data-map-form.component.html',
	styleUrls: ['./data-map-form.component.css']
})
export class DataMapFormComponent implements OnInit {

	dataMapForm: FormGroup;
	codDataMap: number;
	isLoading = false;

	listaBaseLegal: BaseLegal[];
	listaMetadados: Metadados[];
	listaCicloVida: CicloDeVida[];

	listaFormaColetas: FormaColeta[];
	listaFormaColetasFiltrados: FormaColeta[];

	listaArmazenamentos: LocalArmazenamento[];
	listaArmazenamentosFiltrados: LocalArmazenamento[];

	listaCompartilhamentos: Compartilhamento[];
	listaCompartilhamentosFiltrados: Compartilhamento[];

	constructor(
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private snackBar: CustomSnackBarService,
		private router: Router,
		private dialog: MatDialog,
		private dataMapService: DataMapService,
		private metadadosService: MetadadosService,
		private baseLegalService: BaseLegalService,
		private cicloVidaService: CicloDeVidaService,
		private compartilhamentoService: CompartilhamentoService,
		private formaColetaService: FormaColetaService,
		private localArmazenamentoService: LocalArmazenamentoService
	) { }

	ngOnInit() {
		//this.isLoading = true;

		this.createForm();
		this.pesquisaDataMap();
	}

	private createForm() {
		this.dataMapForm = this.formBuilder.group({
			codCicloMonitoramento: ["", Validators.required],
			codAtividade: ["", Validators.required],

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
	}

	salvarDataMap() {

		//if (this.dataMapForm.valid) {
		const DataMap: DataMap = this.dataMapForm.getRawValue();
		DataMap.codDataMap = this.codDataMap;

		DataMap.indPrincipios = (this.dataMapForm.controls.indPrincipios.value ? 1 : 0);
		DataMap.indSensivel = (this.dataMapForm.controls.indSensivel.value ? 1 : 0);
		DataMap.indDadosMenores = (this.dataMapForm.controls.indDadosMenores.value ? 1 : 0);

		DataMap.indNecessitaConsentimento = (this.dataMapForm.controls.indNecessitaConsentimento.value ? 1 : 0);
		DataMap.indTransfInternacional = (this.dataMapForm.controls.indTransfInternacional.value ? 1 : 0);
		DataMap.indAnonimizacao = (this.dataMapForm.controls.indAnonimizacao.value ? 1 : 0);

		DataMap.indRisco = parseInt(this.dataMapForm.controls.indRisco.value);
		DataMap.indTipo = 0;
		console.log(DataMap);

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
}
