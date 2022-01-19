import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { MatDialog, MatAutocomplete, MatAutocompleteSelectedEvent } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Area } from 'src/app/models/area/area';
import { Atividade } from 'src/app/models/atividade/atividade';
import { CicloDeVida } from 'src/app/models/ciclo-de-vida/ciclo-de-vida';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { DataFlow } from 'src/app/models/data-flow/data-flow';
import { Empresa } from 'src/app/models/empresa/empresa';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { Metadados } from 'src/app/models/metadados/metadados';
import { Processo } from 'src/app/models/processo/processo';
import { Usuario } from 'src/app/models/usuario/usuario';
import { AreaService } from 'src/app/services/area.service';
import { AtividadeService } from 'src/app/services/atividade.service';
import { AuthService } from 'src/app/services/auth.service';
import { CicloDeVidaService } from 'src/app/services/ciclo-de-vida.service';
import { CicloMonitoramentoService } from 'src/app/services/ciclo-monitoramento.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DataFlowService } from 'src/app/services/data-flow.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { Usuario2 } from './../../../models/usuario/usuario2';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { FormaColeta } from 'src/app/models/forma-coleta/forma-coleta';
import { FormaColetaService } from 'src/app/services/forma-coleta.service';

@Component({
	selector: 'app-data-flow-form',
	templateUrl: './data-flow-form.component.html',
	styleUrls: ['./data-flow-form.component.css']
})
export class DataFlowFormComponent implements OnInit {

	dataFlowForm: FormGroup;
	codDataFlow: number;
	isLoading = false;

	codCicloMonitoramento: number;

	listaAtividade: Atividade[];

	listaMetadados: Metadados[];
	metadados: Metadados[];
	listaMetadadosFiltrados: Observable<Metadados []>;
  
	separatorKeysCodes: number[] = [ENTER, COMMA];
	metadadosCtrl = new FormControl();
	metadadosDataFlow: Metadados[] = [];

	listaArmazenamentos: LocalArmazenamento[];
	listaArmazenamentosFiltrados: LocalArmazenamento[];

	listaCompartilhamentos: Compartilhamento[];
	listaCompartilhamentosFiltrados: Compartilhamento[];

	listaUsuarios: Usuario[];
	listaUsuariosFiltrados: Usuario[];

	listaCicloVida: CicloDeVida[];

	listaEmpresas: Empresa[];
	listaEmpresasFiltradas: Observable<Empresa[]>;

	listaAreas: Area[];
	listaAreasFiltradas: Observable<Area[]>;

	listaProcessos: Processo[];
	listaProcessosFiltradas: Observable<Processo[]>;

	listaFormaColetas: FormaColeta[];
	listaFormaColetasFiltrados: FormaColeta[];

	usuarioSelecionado: Usuario[];
	formaColetaSelecionado: FormaColeta[];
	armazenamentoSelecionado: LocalArmazenamento[];
	compartilhamentoSelecionado: Compartilhamento[];

	@ViewChild('metadadosInput',{static: false}) metadadosInput: ElementRef<HTMLInputElement>;

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
		private empresaService: EmpresaService,
		private cicloMonitoramentoService: CicloMonitoramentoService,
		private areaService: AreaService,
		private processoService: ProcessoService,
		private formaColetaService: FormaColetaService,
	) { }

	ngOnInit() {
		//this.isLoading = true;

		this.createForm();		
		this.pesquisaDataFlow();
	}

	private createForm() {
		this.dataFlowForm = this.formBuilder.group({

			codEmpresa: [0, Validators.required],
			empresa: ["", Validators.required],
			dataCompetencia: [""],

			codArea: ["", Validators.required],
			area: ["", Validators.required],

			codProcesso: ["", Validators.required],
			processo: ["", Validators.required],

			codAtividade: ["", Validators.required],
			atividade: ["", Validators.required],

			indDescarte: [""],
			indRisco: ["", Validators.required],

			codCicloVida: ["", Validators.required],
			cicloVida: ["", Validators.required],

			formaColetas: ["", Validators.required],
			usuarios: ["", Validators.required],
			armazenamentos: ["", Validators.required],
			compartilhamentos: ["", Validators.required]

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

								codEmpresa: retorno.body[0].codEmpresa,								
								dataCompetencia: retorno.body[0].dataCompetencia,
								
								codArea: retorno.body[0].codArea,
								codProcesso: retorno.body[0].codProcesso,
								codAtividade: retorno.body[0].codAtividade,

								indDescarte: retorno.body[0].indDescarte,
								indRisco: retorno.body[0].indRisco,

								codCicloVida: retorno.body[0].codCicloVida,

								formaColetas: retorno.body[0].formaColetas,
								usuarios: retorno.body[0].usuarios,
								armazenamentos: retorno.body[0].armazenamentos,
								compartilhamentos: retorno.body[0].compartilhamentos
							});

							this.metadadosDataFlow = retorno.body[0].metadados;

							this.codCicloMonitoramento = retorno.body[0].codCicloMonitoramento;

							this.preencherCombos();

							this.pesquisaArea(retorno.body[0].codEmpresa);
							this.pesquisaProcesso(retorno.body[0].codArea);
							this.pesquisaAtividade(retorno.body[0].codProcesso);
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

		this.pesquisaEmpresas();

		this.pesquisaFormaColetas();
		this.pesquisaLocalArmazenamento();
		this.pesquisaCompartilhamentos();
		this.pesquisaCicloVida();
		this.pesquisaMetadados();
	}

	salvarDataFlow() {

		if (this.dataFlowForm.valid) {

			if (this.codCicloMonitoramento == null)
			{
				TrataExcessaoConexao.TrataExcessao('Não Existem Ciclos de Monitoramento para a Empresa Selecionada!', this.snackBar);
				return;
			}

			if (this.metadadosDataFlow.length===0)
			{
				this.showMessage("Deve Ser Selecionado ao menos um Metadado","Warn");
				return;
			}

			const DataFlow: DataFlow = this.dataFlowForm.getRawValue();
			DataFlow.codDataFlow = this.codDataFlow;

			DataFlow.indRisco = parseInt(this.dataFlowForm.controls.indRisco.value);
			DataFlow.indDescarte = (this.dataFlowForm.controls.indDescarte.value ? 1 : 0);

			var usuarios2 = new Array();
			DataFlow.usuarios.forEach(function (e, i) {
				let usuario2: Usuario2 = new Usuario2;
				usuario2.codUsuario = e.codigoUsuario == null ? e.codUsuario : e.codigoUsuario;
				usuarios2.push(usuario2);
			});
			DataFlow.usuarios = usuarios2;
			DataFlow.codUsuarioInclusao = this.authService.loggedUserId;

			DataFlow.codCicloMonitoramento = this.codCicloMonitoramento;
			DataFlow.metadados = this.metadadosDataFlow;

			if (this.codDataFlow) {
				// Alteração
				this.DataFlowService.alterarDataFlow(DataFlow).subscribe(
					(response) => {
						this.snackBar.openSnackBar(`Data Flow Atualizado com Sucesso!`, null);
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
						this.snackBar.openSnackBar(`Data Flow Criado com Sucesso!`, null);
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
		} else {
      		this.showMessage("Campos obrigatórios não foram preenchidos", "Warn");
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
		this.usuarioService.listaTodosUsuarios(false).subscribe(
			(retorno) => {
				this.listaUsuarios = retorno.body;
				let codEmpresa = this.dataFlowForm.controls.codEmpresa.value;
				let codArea    = this.dataFlowForm.controls.codArea.value;
				this.listaUsuariosFiltrados = <Usuario[]>this.listaUsuarios.filter(usuario => usuario.codigoEmpresa == codEmpresa && usuario.codigoArea == codArea);
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

		this.metadadosDataFlow = selecionado.metadados;    
        
        this.removeSelecionados();

	}

	remove(metadados: Metadados): void {
		const index = this.metadadosDataFlow.indexOf(metadados);

		if (index >= 0) {
			this.metadadosDataFlow.splice(index, 1);
			this.listaMetadados.push(metadados);
		}

		this.listaMetadados.sort((a,b) => a.nomeMetadados.localeCompare(b.nomeMetadados));

		this.metadadosCtrl.setValue("");
	}
	
	selectedMetadados(event: MatAutocompleteSelectedEvent): void {
		this.metadadosDataFlow.push(event.option.value);
	
		this.metadadosInput.nativeElement.value = '';
		const index = this.listaMetadados.indexOf(event.option.value);
	
		if (index >= 0) {
		  this.listaMetadados.splice(index, 1);
		}
		this.metadadosCtrl.setValue("");
	  }

	private pesquisaAtividade(codProcesso: number) {
		this.isLoading = true;
		this.atividadeService.listaAtivadadesPorProcesso(codProcesso).subscribe(
			(retorno) => {
				this.isLoading = false;
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
			
			this.removeSelecionados();
		
			this.listaMetadadosFiltrados = this.metadadosCtrl.valueChanges
			  .pipe(
				startWith(''),
				map(value => typeof value === 'string' ? value: value.nomeMetadados),
				map(name => {
				  return name ? this.filtraMetadados(name): this.listaMetadados.slice();
				})
			  );
	
			  this.isLoading = false;
	
		  });
	
		this.isLoading = false;
	  }

	removeSelecionados()
	{
		var index = -1;
		if (this.listaMetadados != undefined && this.listaMetadados.length!=0 &&
			this.metadadosDataFlow != undefined && this.metadadosDataFlow.length!=0)
		{
		var listaAux = this.listaMetadados;
		this.listaMetadados = [];
		listaAux.forEach(meta => {
			index = -1;
			this.metadadosDataFlow.forEach(metaDataFlow => {
			if (meta.codMetadados === metaDataFlow.codMetadados)
			{
				index = 1;
			}          
			});

			if (index===-1)
			{
			this.listaMetadados.push(meta);
			}
		});
		this.listaMetadados.sort((a,b) => a.nomeMetadados.localeCompare(b.nomeMetadados));
		
		this.metadadosCtrl.setValue("");
		}
	}  

	filtraMetadados(value: string): Metadados[] {
		const filterValue = value.toLowerCase();

		return this.listaMetadados.filter(item => item.nomeMetadados.trim().toLowerCase().includes(filterValue));
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

	private pesquisaEmpresas() {
		this.empresaService.listaTodasEmpresas().subscribe(
			(retorno) => {
				this.listaEmpresas = retorno.body;

				let codEmpresa = this.dataFlowForm.controls.codEmpresa.value;
				if (codEmpresa != 0) {
					let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
					if (empresaSel)
						this.dataFlowForm.controls.empresa.setValue(empresaSel);
				}

				this.listaEmpresasFiltradas = this.dataFlowForm.controls.empresa.valueChanges
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
		this.dataFlowForm.controls.empresa.setValue(empresaSelecionada);
		this.dataFlowForm.controls.codEmpresa.setValue(empresaSelecionada.codigoEmpresa);

		this.dataFlowForm.controls.area.setValue(null);
		this.dataFlowForm.controls.codProcesso.setValue(null);
		this.dataFlowForm.controls.processo.setValue(null);
		this.dataFlowForm.controls.codAtividade.setValue(null);
    	this.dataFlowForm.controls.atividade.setValue(null);

		this.buscarUltimoCicloMonitoramento(empresaSelecionada.codigoEmpresa);

		this.pesquisaArea(empresaSelecionada.codigoEmpresa);

    //this.isLoading = true;
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
          			this.dataFlowForm.controls.dataCompetencia.setValue(retorno.body.dataCompetencia);
				} else {
					this.codCicloMonitoramento = null;
					TrataExcessaoConexao.TrataExcessao('Não existem ciclos de monitoramento para a empresa selecionada!', this.snackBar);
				}
			}
		)		
	}

	private pesquisaArea(codEmpresa:number) {
		this.areaService.listaAreasPorEmpresa(codEmpresa).subscribe(
			(retorno) => {
				this.listaAreas = retorno.body;

				let codArea = this.dataFlowForm.controls.codArea.value;
				if (codArea != 0) {
					let areaSel: Area = <Area>this.listaAreas.filter(area => area.codArea == codArea)[0];
					if (areaSel)
						this.dataFlowForm.controls.area.setValue(areaSel);
				}

				this.listaAreasFiltradas = this.dataFlowForm.controls.area.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "": value),
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
		this.dataFlowForm.controls.area.setValue(areaSelecionada);
		this.dataFlowForm.controls.codArea.setValue(areaSelecionada.codArea);

    	this.dataFlowForm.controls.codProcesso.setValue(null);
		this.dataFlowForm.controls.processo.setValue(null);
		this.dataFlowForm.controls.codAtividade.setValue(null);
		this.dataFlowForm.controls.atividade.setValue(null);
		this.pesquisaUsuarios();

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

				let codProcesso = this.dataFlowForm.controls.codProcesso.value;
				if (codProcesso != 0) {
					let processoSel: Processo = <Processo>this.listaProcessos.filter(processo => processo.codProcesso == codProcesso)[0];
					if (processoSel)
						this.dataFlowForm.controls.processo.setValue(processoSel);
				}

				this.listaProcessosFiltradas = this.dataFlowForm.controls.processo.valueChanges
					.pipe(
						startWith(''),
						map(value => value === undefined || value === null ? "": value),
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
		this.dataFlowForm.controls.processo.setValue(processoSelecionada);
		this.dataFlowForm.controls.codProcesso.setValue(processoSelecionada.codProcesso);

    	this.dataFlowForm.controls.codAtividade.setValue(null);
    	this.dataFlowForm.controls.atividade.setValue(null);

		this.pesquisaAtividade(processoSelecionada.codProcesso);
	}

	displayProcesso(processo: Processo): string {
		return processo ? processo.nomeProcesso : "";
	}

	closeDatePicker(eventData: any, picker:any) {

    	this.dataFlowForm.controls.dataCompetencia.setValue(eventData);
      	picker.close();
    }

	private showMessage(msg: string, type: string = "Success") {
   	 	this.snackBar.openSnackBar(msg, null, type);
  	}

}
