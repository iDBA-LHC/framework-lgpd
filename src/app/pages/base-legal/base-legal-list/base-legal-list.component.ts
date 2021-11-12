import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { BaseLegalService } from 'src/app/services/base-legal.service';
import { BaseLegal } from 'src/app/models/base-legal/base-legal';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { environment } from 'src/environments/environment';

@Component({
    selector: 'app-base-legal-list',
    templateUrl: './base-legal-list.component.html',
    styleUrls: ['./base-legal-list.component.css']
})

export class BaseLegalListComponent implements OnInit {
    isLoading = false;
    permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

    displayedColumns: string[] = ["nomeBase", "actions"];

    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;

    constructor(
        private baseLegalService: BaseLegalService,
        private snackBar: CustomSnackBarService,
        private dialog: MatDialog,
        private exportPdfService: ExportPdfService,
        private authService: AuthService
    ) { }


    ngOnInit(): void {
        this.pesquisaBasesLegais();
    }

    pesquisaBasesLegais() {
        this.isLoading = true;
        this.baseLegalService.listaTodasBasesLegais().subscribe(
            (response) => {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<BaseLegal>(response.body);
                
                setTimeout(() => {
                    this.dataSource.filterPredicate = (
                        data: {
                            nomeBase: string
                        },
                        filterValue: string
                    ) => data.nomeBase.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            },
            (err) => {
                if (err.status == 401) {
                    TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaBasesLegais();}));
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

    excluir(baseLegal: BaseLegal)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Base Legal",
              msg: `Tem certeza que deseja prosseguir com exclusão da Base Legal ${baseLegal.nomeBase}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusao(baseLegal);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusao(baseLegal:BaseLegal)
    {
        this.baseLegalService.excluirBaseLegal(baseLegal.codigoBase).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Base Legal ${baseLegal.nomeBase} foi excluída com Sucesso.`,
              null
            );
            this.pesquisaBasesLegais();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusao(baseLegal);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }

}