import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { CicloMonitoramento } from 'src/app/models/ciclo-monitoramento/ciclo-monitoramento';
import { AuthService } from 'src/app/services/auth.service';
import { CicloMonitoramentoService } from 'src/app/services/ciclo-monitoramento.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-ciclo-monitoramento-list',
  templateUrl: './ciclo-monitoramento-list.component.html',
  styleUrls: ['./ciclo-monitoramento-list.component.css']
})
export class CicloMonitoramentoListComponent implements OnInit {
  isLoading = false;

  displayedColumns: string[] = ["codEmpresa", "nomeCicloMonitoramento", "dataCompetencia", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    private cicloMonitoramentoService: CicloMonitoramentoService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaCicloMonitoramentos();
  }

  pesquisaCicloMonitoramentos( ) {
    this.isLoading = true;
    this.cicloMonitoramentoService.listaTodosCicloMonitoramentos().subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<CicloMonitoramento>(response.body);
        setTimeout(() => {
          this.dataSource.filterPredicate = (
            data: {
              nomeCicloMonitoramento: string,
              dataCompetencia: string,
              codEmpresa: string,
            },
            filterValue: string
          ) => data.nomeCicloMonitoramento.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
               data.dataCompetencia.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
               data.codEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ;

          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        });
      },
      (err) =>{
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaCicloMonitoramentos();}));
        }
        else
        {
          this.isLoading = false;
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }
    );
  }

}
