import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Empresa } from 'src/app/models/empresa/empresa';
import { StatusIncidenteButtons } from 'src/app/models/incidente/buttons/status-incidente-buttons';
import { Usuario } from 'src/app/models/usuario/usuario';
import { EmpresaService } from 'src/app/services/empresa.service';
import { UsuarioService } from 'src/app/services/usuario.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-incidente-form',
  templateUrl: './incidente-form.component.html',
  styleUrls: ['./incidente-form.component.css']
})
export class IncidenteFormComponent implements OnInit {

  form: FormGroup;
  codigoIncidente: number;
  isLoading = false;

  listaEmpresas: Empresa[];
  listaEmpresasFiltradas: Observable<Empresa[]>;

  listaUsuarios: Usuario[];
  listaUsuariosEncarregados: Usuario[];
  listaUsuariosOperador: Usuario[];

  listaUsuariosEncarregadosFiltrados: Observable<Usuario[]>;
  listaUsuariosOperadorFiltrados: Observable<Usuario[]>;

  statusIncidenteButtons = new StatusIncidenteButtons();

  constructor(private empresaService: EmpresaService,
			  private usuarioService: UsuarioService,
              private formBuilder: FormBuilder) { }

  ngOnInit() {
    this.createForm();

    this.preencherCombos();

  }

  private createForm() {
		this.form = this.formBuilder.group({

			codigoEmpresa: [0, Validators.required],
			empresa: ["", Validators.required],
			numeroCNPJ: [,],

			codigoUsuarioEncarregado: [, Validators.required],
			usuarioEncarregado: [, Validators.required],

			codigoUsuarioOperador: [, Validators.required],
			usuarioOperador: [,Validators.required],

			dataHoraRegistro: [new Date(),Validators.required],
			dataHoraIncidente: [new Date(), Validators.required],

			dataComunicacao: [new Date(), Validators.required],

			desJustificativa: [,],

			indStatus: [1, Validators.required],

			desTipoComunicacao: ["",],
			dadosAgenteTratamento: ["",],
			dadosNotificante: ["",],
			dadosEncarregado: ["",],
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

  preencherCombos() {

		this.pesquisaEmpresas();

  }

  salvar()
  {

  }

  private pesquisaEmpresas() {
		this.empresaService.listaTodasEmpresas().subscribe(
			(retorno) => {
				this.listaEmpresas = retorno.body;

				let codEmpresa = this.form.controls.codigoEmpresa.value;
				if (codEmpresa != 0) {
					let empresaSel: Empresa = <Empresa>this.listaEmpresas.filter(empresa => empresa.codigoEmpresa == codEmpresa)[0];
					if (empresaSel)
						this.form.controls.empresa.setValue(empresaSel);

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

	private filtraUsuario(lista: Usuario[], value: string): Usuario[] {
		const filterValue = value.toLowerCase();
		return lista.filter(item => item.nomeUsuario.trim().toLowerCase().includes(filterValue));
	}

	selecionaUsuario(campo, campoCodigo, event) {
		let empresaSelecionada: Empresa = event.option.value;
		this.form.controls[campo].setValue(empresaSelecionada);
		this.form.controls[campoCodigo].setValue(empresaSelecionada.codigoEmpresa);
	}

	displayUsuario(usuario: Usuario): string {
		return usuario ? usuario.nomeUsuario : "";
	}

	

}
