import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Metadados } from 'src/app/models/metadados/metadados';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { environment } from 'src/environments/environment';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-metadados-list',
  templateUrl: './metadados-list.component.html',
  styleUrls: ['./metadados-list.component.css']
})

export class MetadadosListComponent implements OnInit {
  isLoading = false;
  permiteExclusao = this.authService.getLoggedUserType() === environment.tipoUsuaruioAdmin;

  displayedColumns: string[] = ["nomeMetadados", "indSensivel", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private metadadosService: MetadadosService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.isLoading = true;
    this.pesquisaMetadados();
  }

  pesquisaMetadados() {
    this.isLoading = true;
    this.metadadosService.listaTodosMetadados().subscribe(
      (response) => {
        this.dataSource = new MatTableDataSource<Metadados>(response.body);

        setTimeout(
          () => {
            this.dataSource.filterPredicate = (
              data: {
                nomeMetadados: string
              },
              filterValue: string
            ) => data.nomeMetadados.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
          }
        );
        this.isLoading = false;
      }, (err) => {
        if (err.status == 401) {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaMetadados();}));
        } else {
            this.isLoading = false;
            TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
        this.isLoading = false;
    }
    )
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  excluir(metadados: Metadados)
    {
        const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Confirmar Exclusão de Metadados",
              msg: `Tem certeza que deseja prosseguir com exclusão do Metadados ${metadados.nomeMetadados}?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.confirmaExclusao(metadados);
              this.isLoading = true;
            }
          });  
    }

    confirmaExclusao(metadados: Metadados)
    {
        this.metadadosService.excluirMetadados(metadados.codMetadados).subscribe((response) => {
            this.snackBar.openSnackBar(
              `Metadados ${metadados.nomeMetadados} foi excluído com Sucesso.`,
              null
            );
            this.pesquisaMetadados();
          },
          (err) => {
            if (err.status === 401)
            {
              TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.confirmaExclusao(metadados);}));
            }
            else
            {
              TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
              this.isLoading = false;
            }
          });
    }

}
