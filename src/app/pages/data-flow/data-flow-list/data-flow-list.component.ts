import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataFlow } from 'src/app/models/data-flow/data-flow';
import { AuthService } from 'src/app/services/auth.service';
import { DataFlowService } from 'src/app/services/data-flow.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-data-flow-list',
  templateUrl: './data-flow-list.component.html',
  styleUrls: ['./data-flow-list.component.css']
})
export class DataFlowListComponent implements OnInit {

  isLoading = false;
  displayedColumns: string[] = ["nomeEmpresa", "nomeArea", "nomeProcesso", "nomeAtividade", "dataCompetencia", "actions"];
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    private dataFlowService: DataFlowService,
    private snackBar: CustomSnackBarService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaDataFlows();
  }

  pesquisaDataFlows() {
    this.isLoading = true;
    this.dataFlowService.listaTodosDataFlow().subscribe((response) => {
      this.isLoading = false;

      this.dataSource = new MatTableDataSource<DataFlow>(response.body);
      setTimeout(() => {
        this.dataSource.filterPredicate = (
          data: {
            nomeEmpresa: string,
            nomeArea: string,
            nomeProcesso: string,
            nomeAtividade: string,
            dataCompetencia: Date,
          },
          filterValue: string
        ) => data.nomeEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
             data.nomeArea.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
             data.nomeProcesso.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
             data.nomeAtividade.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
             data.dataCompetencia.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      });
    },
      (err) => {
        if (err.status === 401) {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaDataFlows(); }));
        }
        else {
          this.isLoading = false;
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }
    );
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
