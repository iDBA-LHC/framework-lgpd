import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { DataMap } from 'src/app/models/data-map/data-map';
import { FormaColeta } from 'src/app/models/forma-coleta/forma-coleta';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { FormaColetaService } from 'src/app/services/forma-coleta.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
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
		private DataMapService: DataMapService,
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
			codBaseLegal: ["", Validators.required],

			indPrincipios: ["", Validators.required],
			indSensivel: ["", Validators.required],
			indDadosMenores: ["", Validators.required],

			formaColetas: ["", Validators.required],
			indNecessitaConsentimento: ["", Validators.required],

			armazenamentos: ["", Validators.required],
			indTransfInternacional: ["", Validators.required],

			compartilhamentos: ["", Validators.required],
			indAnonimizacao: ["", Validators.required],

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
					this.DataMapService.pesquisaDataMap(this.codDataMap).subscribe(
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
				this.DataMapService.alterarDataMap(DataMap).subscribe(
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
				this.DataMapService.incluirDataMap(DataMap).subscribe(
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
}
