import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Metadados } from 'src/app/models/metadados/metadados';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { MetadadosService } from 'src/app/services/metadados.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-metadados-list',
  templateUrl: './metadados-list.component.html',
  styleUrls: ['./metadados-list.component.css']
})

export class MetadadosListComponent implements OnInit {
  isLoading = false;

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
    this.isLoading = false;
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
    }
    )
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
