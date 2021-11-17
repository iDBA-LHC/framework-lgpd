import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { Atividade } from 'src/app/models/atividade/atividade';
import { Contrato } from 'src/app/models/contrato/contrato';
import { Processo } from 'src/app/models/processo/processo';
import { AtividadeService } from 'src/app/services/atividade.service';
import { AuthService } from 'src/app/services/auth.service';
import { ContratoService } from 'src/app/services/contrato.service';
import { ProcessoService } from 'src/app/services/processo.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-processo-form',
  templateUrl: './processo-form.component.html',
  styleUrls: ['./processo-form.component.css']
})
export class ProcessoFormComponent implements OnInit {

  permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

  processoForm: FormGroup;
  processoId: number;
  areaId: number;
  isLoading = false;

  displayedColmunsAtividade: string[] = ["nomeAtividade", "actions"];
  dataSourceAtividade = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginatorAtividade: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortAtividade: MatSort;

  displayedColmunsContrato: string[] = ["objetoContrato", "actions"];
  dataSourceContrato = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginatorContrato: MatPaginator;
  @ViewChild(MatSort, { static: false }) sortContrato: MatSort;


  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private processoService: ProcessoService,
    private atividadeService: AtividadeService,
    private contratoService: ContratoService,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private dialog: MatDialog,
  ) { }

  ngOnInit() {
    this.isLoading = true;

    this.createForm();
    this.pesquisaProcesso();
  }

  private createForm() {
    this.processoForm = this.formBuilder.group({
      nomeProcesso: ["", Validators.required],
      obsProcesso: [],
    });
  }

  private pesquisaProcesso() {
    this.activatedRoute.params.subscribe(
      (data) => {
        this.areaId = parseInt(data["areaId"]);
        this.processoId = parseInt(data["id?"]);

        if (this.processoId) {
          this.processoService.pesquisaProcesso(this.processoId).subscribe(
            (retorno) => {
              this.processoForm.patchValue({
                nomeProcesso: retorno.body[0].nomeProcesso,
                obsProcesso: retorno.body[0].obsProcesso
              });

              this.pesquisaAtividades();
              this.pesquisaContratos();

              this.isLoading = false;
            }
          )
        } else {
          this.isLoading = false;
        }
      }
    )
  }

  private pesquisaAtividades() {
    this.atividadeService.listaAtivadadesPorProcesso(this.processoId).subscribe(
      (response) => {
        this.dataSourceAtividade = new MatTableDataSource<Atividade>(response.body);
        setTimeout(() => {
          this.dataSourceAtividade.filterPredicate = (
            data: {
              nomeAtividade: string
            },
            filterValue: string
          ) => data.nomeAtividade.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

          this.dataSourceAtividade.paginator = this.paginatorAtividade;
          this.dataSourceAtividade.sort = this.sortAtividade;
        });
        this.isLoading = false;
      }
    );
  };

  applyFilterAtividade(value: string) {
    this.dataSourceAtividade.filter = value.trim().toLowerCase();
  }

  private pesquisaContratos() {
    this.contratoService.listaContratosPorProcesso(this.processoId).subscribe(
      (response) => {
        this.dataSourceContrato = new MatTableDataSource<Contrato>(response.body);
        setTimeout(() => {
          this.dataSourceContrato.filterPredicate =(
            data: {
              objetoContrato: string
            },
            filterValue: string
          ) => data.objetoContrato.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

          this.dataSourceContrato.paginator = this.paginatorContrato;
          this.dataSourceContrato.sort = this.sortContrato;

        });
        this.isLoading = false;
      }
    )
  };

  applyFilterContrato(value: string) {
    this.dataSourceContrato.filter = value.trim().toLowerCase();
  }


  salvarProcesso() {
    if (this.processoForm.valid) {
      const processo: Processo = this.processoForm.getRawValue();
      processo.codProcesso = this.processoId;
      processo.codArea = this.areaId;
      processo.codUsuarioAlteracao = this.authService.getLoggedUserId();

      if (this.processoId) {
        // Alteração
        this.processoService.alterarProcesso(processo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Processo ${processo.nomeProcesso} foi atualizado com sucesso!`,null);
            this.router.navigate(["/area", this.areaId]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarProcesso();}));            
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
            }
          }
        )
      } else {
        // Inclusão
        this.processoService.incluirProcesso(processo).subscribe(
          (response) => {
            this.snackBar.openSnackBar(`O Processo ${processo.nomeProcesso} foi criado com sucesso!`,null);
            this.router.navigate(["/area", this.areaId]);
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.salvarProcesso();}));
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

  navigateToArea()
	{
    this.router.navigate(["/area", this.areaId]);
  }

  openNewWindow(contrato: Contrato): void {
    const url = contrato.enderecoDocumento;
  
    window.open(url, '_blank');
  }
  
  excluirContrato(contrato: Contrato)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Contrato",
              msg: `Tem certeza que deseja prosseguir com exclusão do Contrato ${contrato.objetoContrato}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusaoContrato(contrato);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusaoContrato(contrato: Contrato)
    {
        this.contratoService.excluirContrato(contrato.codContrato).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Contrato ${contrato.objetoContrato} foi excluída com Sucesso.`,
              null
            );
            this.pesquisaContratos();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusaoContrato(contrato);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }

    excluirAtividade(atividade: Atividade)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Atividade",
              msg: `Tem certeza que deseja prosseguir com exclusão da Atividade ${atividade.nomeAtividade}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusaoAtividade(atividade);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusaoAtividade(atividade: Atividade)
    {
        this.atividadeService.excluirAtividade(atividade.codAtividade).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Atividade ${atividade.nomeAtividade} foi excluída com Sucesso.`,
              null
            );
            this.pesquisaAtividades();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusaoAtividade(atividade);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }

}
