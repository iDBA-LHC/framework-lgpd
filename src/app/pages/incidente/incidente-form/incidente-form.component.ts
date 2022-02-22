import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { StatusIncidenteButtons } from 'src/app/models/incidente/buttons/status-incidente-buttons';
import { Incidente } from 'src/app/models/incidente/incidente';
import { Protocolo } from 'src/app/models/incidente/protocolo';
import { Usuario } from 'src/app/models/usuario/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { IncidenteService } from 'src/app/services/incidente.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { DateFormatPipe } from 'src/app/shared/components/pipe/date-format-pipe';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incidente-form',
  templateUrl: './incidente-form.component.html',
  styleUrls: ['./incidente-form.component.css']
})
export class IncidenteFormComponent implements OnInit {

	usuarioAdmin:boolean = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;	
  	form: FormGroup;
  	codigoIncidente: number;
  	indStatus: number;
  	isLoading = false;
  	indNoPrazo = undefined;

  	listaEmpresas: Empresa[];
  	listaEmpresasFiltradas: Observable<Empresa[]>;

	listaUsuarios: Usuario[];
	listaUsuariosEncarregados: Usuario[];
	listaUsuariosOperador: Usuario[];

	listaUsuariosEncarregadosFiltrados: Observable<Usuario[]>;
	listaUsuariosOperadorFiltrados: Observable<Usuario[]>;

	private datePipe:DateFormatPipe = new DateFormatPipe();

	statusIncidenteButtons = new StatusIncidenteButtons();

	constructor(private empresaService: EmpresaService,
				private activatedRoute: ActivatedRoute,
				private usuarioService: UsuarioService,
				private service: IncidenteService,
				private snackBar: CustomSnackBarService,
				private router: Router,
				private authService: AuthService,
				private formBuilder: FormBuilder) { }

	ngOnInit() {
		this.createForm();

		if (!this.usuarioAdmin)
		{
			this.form.controls.codigoEmpresa.setValue(this.authService.getLoggedEmpresaUser());
		}

		this.pesquisa();
	}

  	private createForm() {
		this.form = this.formBuilder.group({

			numeroProtocolo: [, Validators.required],

			codigoEmpresa: [0, Validators.required],
			empresa: ["", Validators.required],
			numeroCNPJ: [,],
			telefoneControlador: [,],

			codigoUsuarioEncarregado: [, Validators.required],
			usuarioEncarregado: [, Validators.required],
			emailEncarregado: [,],

			codigoUsuarioOperador: [, Validators.required],
			usuarioOperador: [,Validators.required],

			dataRegistro: [new Date(),Validators.required],
			dataIncidente: [new Date(), Validators.required],

			dataComunicacao: [, Validators.required],

			desJustificativa: ["",],

			indStatus: [1, Validators.required],

			desTipoComunicacao: ["",],
			dadosAgenteTratamento: ["",],
			dadosNotificante: ["",],
			desDetalhes: ["",],
			desNaturezaDados: ["",],
			desTipoTitulares: ["",],
			desMedidasPreventivas: ["",],
			desMedidasMitigatorias: ["",],
			indRelatorioImpacto: [0,],
			desConsequencias: ["",],
			desLinkDocumento: ["",],
		});
	}

	private pesquisa() {
		this.activatedRoute.params.subscribe((data) => {
		  if (data["id?"]) {
			this.codigoIncidente = parseInt(data["id?"]);
			this.service.pesquisar(this.codigoIncidente).subscribe(
			  (retorno) => {

				if (!this.usuarioAdmin)
				{
					if (retorno.body[0].codigoEmpresa != this.authService.getLoggedEmpresaUser())
					{
						this.snackBar.openSnackBar("Você Não Tem Permissão de Acesso a Este Incidente", null, "Warn");
						this.navigateToIncidenteList();
					}
				}

				this.form.patchValue({

				  numeroProtocolo: retorno.body[0].numeroProtocolo,
				  codigoEmpresa: retorno.body[0].codigoEmpresa,
				  codigoUsuarioEncarregado: retorno.body[0].codigoUsuarioEncarregado,
				  codigoUsuarioOperador: retorno.body[0].codigoUsuarioOperador,
				  dataRegistro: retorno.body[0].dataRegistro,
				  dataIncidente: retorno.body[0].dataIncidente,
				  dataComunicacao: this.datePipe.transformToScreen(retorno.body[0].dataComunicacao),
				  desJustificativa: retorno.body[0].desJustificativa,
				  indStatus: retorno.body[0].indStatus,

				  desTipoComunicacao: retorno.body[0].desTipoComunicacao,
				  dadosAgenteTratamento: retorno.body[0].dadosAgenteTratamento,
				  dadosNotificante: retorno.body[0].dadosNotificante,
				  desDetalhes: retorno.body[0].desDetalhes,
				  desNaturezaDados: retorno.body[0].desNaturezaDados,
				  desTipoTitulares: retorno.body[0].desTipoTitulares,
				  desMedidasPreventivas: retorno.body[0].desMedidasPreventivas,
				  desMedidasMitigatorias: retorno.body[0].desMedidasMitigatorias,
				  indRelatorioImpacto: retorno.body[0].indRelatorioImpacto,
				  desConsequencias: retorno.body[0].desConsequencias,
				  desLinkDocumento: retorno.body[0].desLinkDocumento
				  
				});

				this.indStatus = retorno.body[0].indStatus;
				this.form.controls['indRelatorioImpacto'].disable();

				if (this.indStatus === 2)
				{
					this.form.controls['indStatus'].disable();
				}

				this.preencherCombos();
				this.verificaComunicacaoNoPrazo();
				
			  });
		  } else {
			this.preencherCombos();
			this.pesquisaProximoProtocolo();
		  }
		});
	  }

  	preencherCombos() {
		this.pesquisaEmpresas();
  	}

	salvar()
	{
		if (this.indNoPrazo === false && this.form.controls['desJustificativa'].value.length === 0)
		{
			this.form.controls['desJustificativa'].setErrors({required: true});
		}
		else
		{
			this.form.controls['desJustificativa'].setErrors(null);
		}

		if (this.form.valid)
		{
			const registro: Incidente = this.form.getRawValue();
			registro.codigoIncidente = this.codigoIncidente;
			registro.dataIncidente = this.form.controls['dataIncidente'].value;
			registro.dataRegistro = this.form.controls['dataRegistro'].value;
			if (this.codigoIncidente)
			{
				//Alteração
				this.service.alterar(registro).subscribe(
					(response) => {
					  this.snackBar.openSnackBar(`O Incidente de Protcolo ${registro.numeroProtocolo} foi alterado com sucesso!`,null);
					  this.navigateToIncidenteList();
					},
					(err) => {
					  if (err.status === 401)
					  {
						TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvar();}));
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
				//Inclusão
				this.service.incluir(registro).subscribe(
					(response) => {
					  this.snackBar.openSnackBar(`O Incidente de Protcolo ${registro.numeroProtocolo} foi criado com sucesso!`,null);
					  this.navigateToIncidenteList();
					},
					(err) => {
					  if (err.status === 401)
					  {
						TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvar();}));
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
			this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
		}
	}

  private pesquisaEmpresas() {
		this.empresaService.listaTodasEmpresas().subscribe(
			(retorno) => {
				this.listaEmpresas = retorno.body;

				let codEmpresa = this.form.controls.codigoEmpresa.value;
				if (codEmpresa != 0) {
					let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
					if (empresaSel)
					{
						this.form.controls.empresa.setValue(empresaSel);
						this.form.controls.numeroCNPJ.setValue(empresaSel.numeroCNPJ);
						this.form.controls.telefoneControlador.setValue(empresaSel.telefoneControlador);
				
						this.pesquisaUsuarios();
					}
				}

				this.listaEmpresasFiltradas = this.form.controls.empresa.valueChanges
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
		this.form.controls.empresa.setValue(empresaSelecionada);
		this.form.controls.codigoEmpresa.setValue(empresaSelecionada.codigoEmpresa);
		this.form.controls.numeroCNPJ.setValue(empresaSelecionada.numeroCNPJ);
		this.form.controls.telefoneControlador.setValue(empresaSelecionada.telefoneControlador);

		this.pesquisaUsuarios();
	}

	displayEmpresa(empresa: Empresa): string {
			
		return empresa && empresa.nomeEmpresa ? empresa.nomeEmpresa : '';
	}

	private pesquisaUsuarios() {
		this.usuarioService.listaTodosUsuarios(false).subscribe(
			(retorno) => {
				this.listaUsuarios = retorno.body;
				let codEmpresa = this.form.controls.codigoEmpresa.value;
				this.listaUsuariosEncarregados = <Usuario[]>this.listaUsuarios.filter(usuario => usuario.codigoEmpresa == codEmpresa &&
																								 usuario.indTipoUsuario == environment.tipoUsuarioEncarregado);
				this.listaUsuariosOperador     = <Usuario[]>this.listaUsuarios.filter(usuario => usuario.codigoEmpresa == codEmpresa &&
																								 usuario.indTipoUsuario == environment.tipoUsuarioOperador);


				let codigoUsuarioEncarregado = this.form.controls['codigoUsuarioEncarregado'].value;

				if (codigoUsuarioEncarregado != 0 && codigoUsuarioEncarregado != null && codigoUsuarioEncarregado != undefined ) {
					let usuarioSel: Usuario = <Usuario>this.listaUsuariosEncarregados.filter(usuario => usuario.codigoUsuario == codigoUsuarioEncarregado)[0];
					if (usuarioSel)
					{
						this.form.controls.usuarioEncarregado.setValue(usuarioSel);
						this.form.controls.emailEncarregado.setValue(usuarioSel.emailUsuario);
					}
				}
				else
				{
					if (this.listaUsuariosEncarregados.length === 1)
					{
						let usuarioSel: Usuario = <Usuario> this.listaUsuariosEncarregados[0];
						if (usuarioSel)
						{
							this.form.controls.usuarioEncarregado.setValue(usuarioSel);
							this.form.controls.codigoUsuarioEncarregado.setValue(usuarioSel.codigoUsuario);
							this.form.controls.emailEncarregado.setValue(usuarioSel.emailUsuario);
						}
					}
				}

				let codigoUsuarioOperador = this.form.controls['codigoUsuarioOperador'].value;

				if (codigoUsuarioOperador != 0 && codigoUsuarioOperador != null && codigoUsuarioOperador != undefined) {
					let usuarioSel: Usuario = <Usuario>this.listaUsuariosOperador.filter(usuario => usuario.codigoUsuario == codigoUsuarioOperador)[0];
					if (usuarioSel)
					{
						this.form.controls.usuarioOperador.setValue(usuarioSel);
					}
				}
				else
				{
					if (this.listaUsuariosOperador.length === 1)
					{
						let usuarioSel: Usuario = <Usuario> this.listaUsuariosOperador[0];
						if (usuarioSel)
						{
							this.form.controls.usuarioOperador.setValue(usuarioSel);
							this.form.controls.codigoUsuarioOperador.setValue(usuarioSel.codigoUsuario);
						}
					}	
				}

				this.listaUsuariosEncarregadosFiltrados = this.form.controls.usuarioEncarregado.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeUsuario),
						map(name => {
							return name ? this.filtraUsuario(this.listaUsuariosEncarregados, name) : this.listaUsuariosEncarregados.slice();
						}));


				this.listaUsuariosOperadorFiltrados = this.form.controls.usuarioOperador.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeUsuario),
						map(name => {
							return name ? this.filtraUsuario(this.listaUsuariosOperador, name) : this.listaUsuariosOperador.slice();
						}));

			}
		)
		this.isLoading = false;
	}

	private pesquisaProximoProtocolo()
	{
		this.service.pesquisaProximoProtocolo().subscribe(
			(response) => {
				var protocolo: Protocolo = response.body; 
				this.form.controls['numeroProtocolo'].setValue(protocolo.numeroProtocolo);
			},
			(err) => {
				if (err.status === 401)
				{
				  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaProximoProtocolo();}));
				}
				else
				{
				  TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
				}
			  }
		);
	}

	verificaComunicacaoNoPrazo()
	{

		var dataComunicacao = new Date(this.form.controls['dataComunicacao'].value);
		var dataHoraIncidente = new Date(this.form.controls['dataIncidente'].value);

		if (this.datediff(dataHoraIncidente, dataComunicacao) > 2)
		{
			this.indNoPrazo = false;
		}
		else{
			this.indNoPrazo = true;
		}
	}

	private datediff(first, second) {
		return Math.round((second-first)/(1000*60*60*24)) + 1;
	}

	private filtraUsuario(lista: Usuario[], value: string): Usuario[] {
		const filterValue = value.toLowerCase();
		return lista.filter(item => item.nomeUsuario.trim().toLowerCase().includes(filterValue));
	}

	selecionaUsuario(campo, campoCodigo, event) {
		let usuarioSelecionado: Usuario = event.option.value;
		this.form.controls[campo].setValue(usuarioSelecionado);
		this.form.controls[campoCodigo].setValue(usuarioSelecionado.codigoUsuario);
		if (campo === 'usuarioEncarregado')
		{
			this.form.controls.emailEncarregado.setValue(usuarioSelecionado.emailUsuario);
		}
	}

	displayUsuario(usuario: Usuario): string {
		return usuario ? usuario.nomeUsuario : "";
	}

	navigateToIncidenteList()
	{
		this.router.navigate(["/incidente"]);
	}

	private requiredIfValidator(predicate) {

		return (formControl => {
		  if (!formControl.parent) {
			return null;
		  }
		  if (predicate()) {
			return Validators.required(formControl); 
		  }
		  return null;
		})
	  }

}