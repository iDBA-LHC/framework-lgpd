import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { DocumentoPlano } from 'src/app/models/documento-plano/documento-plano';
import { PlanoMitigacao } from 'src/app/models/plano-mitigacao/plano-mitigacao';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { DocumentoPlanoService } from 'src/app/services/documento-plano.service';
import { PlanoMitigacaoService } from 'src/app/services/plano-mitigacao.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-plano-mitigacao-form',
  templateUrl: './plano-mitigacao-form.component.html',
  styleUrls: ['./plano-mitigacao-form.component.css']
})
export class PlanoMitigacaoFormComponent implements OnInit {

  planoMitigacaoForm: FormGroup;
  codPlanoMitigacao: number;
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
    private compartilhamentoService: CompartilhamentoService
  ) { }

  ngOnInit() {
    //this.isLoading = true;

    this.createForm();
    this.pesquisaPlanoMitigacao();
  }

  private createForm() {
    this.planoMitigacaoForm = this.formBuilder.group({
      codPlanoMitigacao: ["", Validators.required],
      codDataMapping: ["", Validators.required],
      desPlanoMitigacao: ["", Validators.required],
      desObservacao: ["", Validators.required],
      dataLimite: ["", Validators.required],
      nomePropoeAjuste: ["", Validators.required],
      nomeAprovador: ["", Validators.required],
      dataElaboracao: ["", Validators.required],
      dataAditivacao: ["", Validators.required],
      dataRevisao: ["", Validators.required],
      dataRecusa: ["", Validators.required],
      desMotivoRecusa: ["", Validators.required],
      dataStatus: ["", Validators.required],

    });
  }

  applyFilterProcesso(value: string) {
    this.dataSourceDocumentoPlano.filter = value.trim().toLowerCase();
  }

  pesquisaPlanoMitigacao() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.codPlanoMitigacao = parseInt(data["id?"]);

        if (this.codPlanoMitigacao) {
          this.PlanoMitigacaoService.pesquisaPlanoMitigacao(this.codPlanoMitigacao).subscribe(
            (retorno) => {
              this.planoMitigacaoForm.patchValue({
                codDataMap: retorno.body[0].codDataMap
              });
              this.pesquisaDocumentoPlano();
            },
            (err) => {
              if (err.status === 401)
                {
                  TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaPlanoMitigacao();}));
                }
                else
                {
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
              nomeDocumentoPlano: string
            },
            filterValue: string
          ) => data.nomeDocumentoPlano.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

          this.dataSourceDocumentoPlano.paginator = this.paginator;
          this.dataSourceDocumentoPlano.sort = this.sort;
        })
      }
    )
  }

  salvarPlanoMitigacao() {
    if (this.planoMitigacaoForm.valid) {
      const PlanoMitigacao: PlanoMitigacao = this.planoMitigacaoForm.getRawValue();
      PlanoMitigacao.codPlanoMitigacao = this.codPlanoMitigacao;

      if (this.codPlanoMitigacao) {
        // Alteração
        this.PlanoMitigacaoService.alterarPlanoMitigacao(PlanoMitigacao).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Plano de Mitigação foi atualizado com sucesso!`,null);
              this.router.navigate(["/plano-mitigacao"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarPlanoMitigacao();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.PlanoMitigacaoService.incluirPlanoMitigacao(PlanoMitigacao).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Plano de Mitigação foi criado com sucesso!`,null);
            this.router.navigate(["/plano-mitigacao"]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarPlanoMitigacao();}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      }
    }
  }
}
