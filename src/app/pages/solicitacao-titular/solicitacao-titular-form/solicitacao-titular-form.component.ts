import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { startWith,map } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { Protocolo } from 'src/app/models/protocolo/protocolo';
import { StatusSolicitacaoTitularButtons } from 'src/app/models/solicitacao-titular/buttons/status-solicitacao-titular-buttons';
import { SolicitacaoTitular } from 'src/app/models/solicitacao-titular/solicitacao-titular';
import { AuthService } from 'src/app/services/auth.service';
import { EmpresaService } from 'src/app/services/empresa.service';
import { SolicitacaoTitularService } from 'src/app/services/solicitacao-titular.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
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

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

  constructor(private empresaService: EmpresaService,
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

  private pesquisa()
  {
    this.activatedRoute.params.subscribe((data) => {
		  if (data["id?"]) {
			  this.codigoSolicitacaoTitular = parseInt(data["id?"]);
      }
      else
      {
        this.pesquisaProximoProtocolo();
        this.pesquisaEmpresas();
      }
    });

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
						/*this.form.controls.telefoneControlador.setValue(empresaSel.telefoneControlador);*/
				
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
		/*this.form.controls.numeroCNPJ.setValue(empresaSelecionada.numeroCNPJ);
		this.form.controls.telefoneControlador.setValue(empresaSelecionada.telefoneControlador);*/
	}

	displayEmpresa(empresa: Empresa): string {
			
		return empresa && empresa.nomeEmpresa ? empresa.nomeEmpresa : '';
	}

  salvar()
  {

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

  navigateToSolicitacaoList()
  {
    this.router.navigate(["/solicitacao-titular"]);
  }

}
