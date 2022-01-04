import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoPlano } from 'src/app/models/documento-plano/documento-plano';
import { PlanoMitigacao } from 'src/app/models/plano-mitigacao/plano-mitigacao';
import { AuthService } from 'src/app/services/auth.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { DocumentoPlanoService } from 'src/app/services/documento-plano.service';
import { PlanoMitigacaoService } from 'src/app/services/plano-mitigacao.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { documentValidator } from 'src/app/shared/utils/app.validator';

@Component({
	selector: 'app-plano-mitigacao-form',
	templateUrl: './plano-mitigacao-form.component.html',
	styleUrls: ['./plano-mitigacao-form.component.css']
})
export class PlanoMitigacaoFormComponent implements OnInit {

	permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

	planoMitigacaoForm: FormGroup;
	codPlanoMitigacao: number;
	codDataMap: number;
	isLoading = false;

	displayedColumns: string[] = ["desDocumentoPlano", "actions"];
	dataSourceDocumentoPlano = new MatTableDataSource();

	@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
	@ViewChild(MatSort, { static: false }) sort: MatSort;

	constructor(
		private activatedRoute: ActivatedRoute,
		private formBuilder: FormBuilder,
		private authService: AuthService,
		private documentoplanoService: DocumentoPlanoService,
		private snackBar: CustomSnackBarService,
		private router: Router,
		private dialog: MatDialog,
		private PlanoMitigacaoService: PlanoMitigacaoService,
		private datamapService: DataMapService
	) { }

	ngOnInit() {
		//this.isLoading = true;

		this.createForm();
		this.pesquisaPlanoMitigacao();
	}

	private createForm() {
		this.planoMitigacaoForm = this.formBuilder.group({			
			desPlanoMitigacao: ["", Validators.required],
			desObservacao: ["", Validators.required],
			dataLimite: ["", Validators.required],
			nomePropoeAjustes: ["", Validators.required],
			nomeAprovador: ["", Validators.required],
			dataElaboracao: ["", Validators.required],
			dataAditivacao: [""],
			dataRevisao: [""],
			dataRecusa: [""],
			desMotivoRecusa: [""],
			dataStatus: [""],

		});
	}

	applyFilterDocumentoPlano(value: string) {
		this.dataSourceDocumentoPlano.filter = value.trim().toLowerCase();
	}

	pesquisaPlanoMitigacao() {
		this.activatedRoute.params.subscribe(
			(data) => {
				this.codPlanoMitigacao = parseInt(data["id?"]);
				this.codDataMap = parseInt(data["codDataMap"]);

				if (this.codPlanoMitigacao) {
					this.PlanoMitigacaoService.pesquisaPlanoMitigacao(this.codPlanoMitigacao).subscribe(
						(retorno) => {
							this.planoMitigacaoForm.patchValue({
								codDataMapping: retorno.body[0].codDataMapping,
								desPlanoMitigacao: retorno.body[0].desPlanoMitigacao,
								desObservacao: retorno.body[0].desObservacao,
								dataLimite: retorno.body[0].dataLimite,
								nomePropoeAjustes: retorno.body[0].nomePropoeAjustes,
								nomeAprovador: retorno.body[0].nomeAprovador,
								dataElaboracao: retorno.body[0].dataElaboracao,
								dataAditivacao: retorno.body[0].dataAditivacao,
								dataRevisao: retorno.body[0].dataRevisao,
								dataRecusa: retorno.body[0].dataRecusa,
								desMotivoRecusa: retorno.body[0].desMotivoRecusa,
								dataStatus: retorno.body[0].dataStatus

							});

							this.pesquisaDocumentoPlano();
						},
						(err) => {
							if (err.status === 401) {
								TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaPlanoMitigacao(); }));
							}
							else {
								TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
							}
						}
					);
				}
			}
		)
	}

	pesquisaDocumentoPlano() {
		this.documentoplanoService.listaTodosDocumentoPlano(this.codPlanoMitigacao).subscribe(
			(response) => {
				this.dataSourceDocumentoPlano = new MatTableDataSource<DocumentoPlano>(response.body);
				setTimeout(() => {
					this.dataSourceDocumentoPlano.filterPredicate = (
						data: {
							desDocumentoPlano: string
						},
						filterValue: string
					) => data.desDocumentoPlano.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

					this.dataSourceDocumentoPlano.paginator = this.paginator;
					this.dataSourceDocumentoPlano.sort = this.sort;
				})
				this.isLoading = false;
			}
		)
	}

	salvarPlanoMitigacao() {
		if (this.planoMitigacaoForm.valid) {

			this.isLoading = true;

			const planoMitigacao: PlanoMitigacao = this.planoMitigacaoForm.getRawValue();
			planoMitigacao.codPlanoMitigacao = this.codPlanoMitigacao;
			planoMitigacao.codDataMapping = this.codDataMap;

			planoMitigacao.dataAditivacao = this.planoMitigacaoForm.controls.dataAditivacao.value == "" ? null : this.planoMitigacaoForm.controls.dataAditivacao.value;
			planoMitigacao.dataRevisao = this.planoMitigacaoForm.controls.dataRevisao.value == "" ? null : this.planoMitigacaoForm.controls.dataRevisao.value;
			planoMitigacao.dataRecusa = this.planoMitigacaoForm.controls.dataRecusa.value == "" ? null : this.planoMitigacaoForm.controls.dataRecusa.value;			

			if (this.codPlanoMitigacao) {
				// Alteração
				this.PlanoMitigacaoService.alterarPlanoMitigacao(planoMitigacao).subscribe(
					(response) => {
						this.snackBar.openSnackBar(`O Plano de Mitigação foi atualizado com sucesso!`, null);
						this.router.navigate(["data-governance-map", this.codDataMap]);
					},
					(err) => {
						if (err.status === 401) {
							TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.salvarPlanoMitigacao(); }));
						}
						else {
							TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
						}
					}
				)
			} else {
				// Inclusão
				this.PlanoMitigacaoService.incluirPlanoMitigacao(planoMitigacao).subscribe(
					(response) => {
						this.snackBar.openSnackBar(`O Plano de Mitigação foi criado com sucesso!`, null);
						this.router.navigate(["data-governance-map", this.codDataMap]);
					},
					(err) => {
						if (err.status === 401) {
							TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.salvarPlanoMitigacao(); }));
						}
						else {
							TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
						}
					}
				)
			}
		}
		else
		{
			this.snackBar.openSnackBar("Campos obrigatórios não foram preenchidos", null, "Warn");
		}
	}

	navigateToDataGovernanceMap()
	{
		this.router.navigate(["data-governance-map", this.codDataMap]);
	}

	openNewWindow(documentoPlano: DocumentoPlano): void {
		const url = documentoPlano.desEnderecoPlano;
	
		window.open(url, '_blank');
	}

	excluirDocumentoPlano(documentoPlano: DocumentoPlano)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Documento do Plano",
              msg: `Tem certeza que deseja prosseguir com exclusão do Documento do Plano ${documentoPlano.desDocumentoPlano}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusaoDocumentoPlano(documentoPlano);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusaoDocumentoPlano(documentoPlano: DocumentoPlano)
    {
        this.documentoplanoService.excluirDocumentoPlano(documentoPlano.codDocumentoPlano).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Documento do Plano ${documentoPlano.desDocumentoPlano} foi excluído com Sucesso.`,
              null
            );
            this.pesquisaDocumentoPlano();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusaoDocumentoPlano(documentoPlano);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }
}
