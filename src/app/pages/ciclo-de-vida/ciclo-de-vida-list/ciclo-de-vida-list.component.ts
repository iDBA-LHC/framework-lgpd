import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CicloDeVida } from 'src/app/models/ciclo-de-vida/ciclo-de-vida';
import { AuthService } from 'src/app/services/auth.service';
import { CicloDeVidaService } from 'src/app/services/ciclo-de-vida.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-ciclo-de-vida-list',
    templateUrl: './ciclo-de-vida-list.component.html',
    styleUrls: ['./ciclo-de-vida-list.component.css']
})

export class CicloDeVidaListComponent implements OnInit {
    isLoading = false;
    permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;
    
    displayedColumns: string[] = ["nomeCicloVida", "actions"];

    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;


    constructor(
        private cicloDeVidaService: CicloDeVidaService,
        private snackBar: CustomSnackBarService,
        private dialog: MatDialog,
        private exportPdfService: ExportPdfService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.pesquisaCiclosDeVida();
    }

    pesquisaCiclosDeVida() {
        this.isLoading = true;
        this.cicloDeVidaService.listaTodosCiclosDeVida().subscribe(
            (response) => {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<CicloDeVida>(response.body);

                setTimeout(() => {
                    this.dataSource.filterPredicate = (
                        data: {
                            nomeCicloVida: string
                        },
                        filterValue: string
                    ) => data.nomeCicloVida.toString().trim().toLowerCase().indexOf(filterValue) !== -1;
                    
                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })
            },
            (err) => {
                if (err.status == 401) {
                    TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaCiclosDeVida();}));
                } else {
                    this.isLoading = false;
                    TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
                }
            }
        )
    }

    applyFilter(value: string) {
        this.dataSource.filter = value.trim().toLowerCase();
    }

    excluir(cicloDeVida: CicloDeVida)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Ciclo de Vida",
              msg: `Tem certeza que deseja prosseguir com exclusão do Ciclo de Vida ${cicloDeVida.nomeCicloVida}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusao(cicloDeVida);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusao(cicloDeVida: CicloDeVida)
    {
        this.cicloDeVidaService.excluirCicloDeVida(cicloDeVida.codCicloVida).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Ciclo de Vida ${cicloDeVida.nomeCicloVida} foi excluída com Sucesso.`,
              null
            );
            this.pesquisaCiclosDeVida();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusao(cicloDeVida);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }
}