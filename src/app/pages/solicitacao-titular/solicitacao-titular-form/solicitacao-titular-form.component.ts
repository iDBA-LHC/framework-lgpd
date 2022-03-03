import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { Protocolo } from 'src/app/models/protocolo/protocolo';
import { DireitoSolicitacaoTitularButtons } from 'src/app/models/solicitacao-titular/buttons/direito-solicitacao-titular-buttons';
import { StatusSolicitacaoTitularButtons } from 'src/app/models/solicitacao-titular/buttons/status-solicitacao-titular-buttons';
import { SolicitacaoTitular } from 'src/app/models/solicitacao-titular/solicitacao-titular';
import { Usuario } from 'src/app/models/usuario/usuario';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SolicitacaoTitularService } from 'src/app/services/solicitacao-titular.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { DateFormatPipe } from 'src/app/shared/components/pipe/date-format-pipe';
import { cpfValidator, emailValidator } from 'src/app/shared/utils/app.validator';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-solicitacao-titular-form',
  templateUrl: './solicitacao-titular-form.component.html',
  styleUrls: ['./solicitacao-titular-form.component.css']
})
export class SolicitacaoTitularFormComponent implements OnInit {

  usuarioAdmin:boolean = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;	
  form: FormGroup;
  codigoSolicitacaoTitular: number;
  indStatus: number;
  isLoading = false;
  statusSolicitacaoTitularButtons = new StatusSolicitacaoTitularButtons();
  direitoSolicitacaoTitularButtons = new DireitoSolicitacaoTitularButtons();

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

  listaUsuarios: Usuario[];;

  listaUsuariosFiltrados: Observable<Usuario[]>;

  private datePipe:DateFormatPipe = new DateFormatPipe();

  constructor(private empresaService: EmpresaService,
			  private usuarioService: UsuarioService,
              private activatedRoute: ActivatedRoute,
              private service: SolicitacaoTitularService,
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

			desNomeTitular: ["", Validators.required],
			numeroCpfTitular: ["", Validators.compose([Validators.required, cpfValidator])],
			numeroDocumentoTitular: ["", Validators.required],

			desNomeRepresentante: ["",],
			numeroCpfRepresentante: [, cpfValidator],
			numeroDocumentoRepresentante: ["", ],

			indDireito: [1, Validators.required],

			emailTitular: ["",Validators.compose([Validators.required, emailValidator])],

			dataInclusao: [new Date()],
			dataPrevisaoRetorno: [new Date(), Validators.required],

			codigoUsuario: [, Validators.required],
			usuario: [, Validators.required],

			dataRetorno: [,],

			indStatus: [1, Validators.required],

			desObservacoes: ["",],
		});
	}

  private pesquisa()
  {
    this.activatedRoute.params.subscribe((data) => {
		if (data["id?"]) {
			this.codigoSolicitacaoTitular = parseInt(data["id?"]);
			this.service.pesquisar(this.codigoSolicitacaoTitular).subscribe(
				(retorno) => {
  
				  if (!this.usuarioAdmin)
				  {
					  if (retorno.body[0].codigoEmpresa != this.authService.getLoggedEmpresaUser())
					  {
						  this.snackBar.openSnackBar("Você Não Tem Permissão de Acesso a Esta Solicitação de Titular", null, "Warn");
						  this.navigateToList();
					  }
				  }
  
				  this.form.patchValue({
  
					numeroProtocolo: retorno.body[0].numeroProtocolo,
					codigoEmpresa: retorno.body[0].codigoEmpresa,
					codigoUsuario: retorno.body[0].codigoUsuario,
					dataInlcusao: this.datePipe.transformToScreen(retorno.body[0].dataInclusao),
					dataPrevisaoRetorno: this.datePipe.transformToScreen(retorno.body[0].dataPrevisaoRetorno),
					dataRetorno: this.datePipe.transformToScreen(retorno.body[0].dataRetorno),
					desObservacoes: retorno.body[0].desObservacoes,
					indStatus: retorno.body[0].indStatus,
					desNomeTitular: retorno.body[0].desNomeTitular,
					numeroCpfTitular: retorno.body[0].numeroCpfTitular,
					numeroDocumentoTitular: retorno.body[0].numeroDocumentoTitular,
					emailTitular: retorno.body[0].emailTitular,
					desNomeRepresentante: retorno.body[0].desNomeRepresentante,
					numeroCpfRepresentante: retorno.body[0].numeroCpfRepresentante,
					numeroDocumentoRepresentante: retorno.body[0].numeroDocumentoRepresentante,
					indDireito: retorno.body[0].indDireito,

				  });
  
				  this.indStatus = retorno.body[0].indStatus;
  
				  if (this.indStatus === 2 || this.indStatus === 3 )
				  {
					  this.form.controls['indStatus'].disable();
				  }

				  this.form.controls['indDireito'].disable();

  
				  this.pesquisaEmpresas();
				  this.pesquisaUsuarios();
				  
				});
      	}
      	else
      	{
			this.form.controls['codigoUsuario'].setValue(this.authService.getLoggedUserId());
        	this.pesquisaProximoProtocolo();
        	this.pesquisaEmpresas();
			this.pesquisaUsuarios();
      	}});
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
	}

	displayEmpresa(empresa: Empresa): string {
			
		return empresa && empresa.nomeEmpresa ? empresa.nomeEmpresa : '';
	}

	private pesquisaUsuarios() {
		this.usuarioService.listaTodosUsuarios(false).subscribe(
			(retorno) => {
				this.listaUsuarios = retorno.body;

				let codigoUsuario = this.form.controls.codigoUsuario.value;

				if (codigoUsuario != 0 && codigoUsuario != null && codigoUsuario != undefined ) {
					let usuarioSel: Usuario = <Usuario>this.listaUsuarios.filter(usuario => usuario.codigoUsuario == codigoUsuario)[0];
					if (usuarioSel)
					{
						this.form.controls.usuario.setValue(usuarioSel);
						this.form.controls.codigoUsuario.setValue(codigoUsuario);
					}
				}
				

				this.listaUsuariosFiltrados = this.form.controls.usuario.valueChanges
					.pipe(
						startWith(''),
						map(value => typeof value === 'string' ? value : value.nomeUsuario),
						map(name => {
							return name ? this.filtraUsuario(this.listaUsuarios, name) : this.listaUsuarios.slice();
						}));
			}
		)
		this.isLoading = false;
	}

	private filtraUsuario(lista: Usuario[], value: string): Usuario[] {
		const filterValue = value.toLowerCase();
		return lista.filter(item => item.nomeUsuario.trim().toLowerCase().includes(filterValue));
	}

	displayUsuario(usuario: Usuario): string {
		return usuario ? usuario.nomeUsuario : "";
	}

	salvar()
	{

		if ((this.form.controls['indStatus'].value === 2 || this.form.controls['indStatus'].value === 3) && this.form.controls['dataRetorno'].value === null)
		{
			this.form.controls['dataRetorno'].setErrors({required: true});
		}
		else
		{
			this.form.controls['dataRetorno'].setErrors(null);
		}

		if (this.form.valid)
		{
			const registro: SolicitacaoTitular = this.form.getRawValue();
			registro.codigoSolicitacaoTitular = this.codigoSolicitacaoTitular;
			registro.dataInclusao = this.form.controls['dataInclusao'].value;
			registro.dataPrevisaoRetorno = this.form.controls['dataPrevisaoRetorno'].value;

			if (this.codigoSolicitacaoTitular)
			{
				//Alteração
				this.service.alterar(registro).subscribe(
					(response) => {
					  this.snackBar.openSnackBar(`A Solicitação de Titular de Protocolo ${registro.numeroProtocolo} foi alterada com sucesso!`,null);
					  this.navigateToList();
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
					  this.snackBar.openSnackBar(`A Solicitação de Titular de Protocolo ${registro.numeroProtocolo} foi criada com sucesso!`,null);
					  this.navigateToList();
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

	navigateToList()
	{
		this.router.navigate(["/solicitacao-titular"]);
	}

}
