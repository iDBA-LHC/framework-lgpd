import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { DataFlow } from 'src/app/models/data-flow/data-flow';
import { DataMapService } from 'src/app/services/data-map.service';
import { AuthService } from 'src/app/services/auth.service';
import { DataFlowService } from 'src/app/services/data-flow.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { Router } from '@angular/router';

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
    private DataMapService: DataMapService,
    private dialog: MatDialog,
    private router: Router,
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

  checkIfDataExists(element) {
    this.DataMapService.pesquisaDataMapCicloAtividadeTipo(element.codCicloMonitoramento, element.codAtividade, 1).subscribe(
      (response) => {
        if (response.body[0]) {
          const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Já Existe Data Analisys Map Cadastrado Para Esta Atividade Neste Ciclo de Monitoramento",
              msg: `Deseja atualizar o Data Analisys Map existente?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.router.navigate(['/priva/data-analisys-map/children', element.codDataFlow, response.body[0].codDataMap]);
            }
          });
        } else {
          this.router.navigate(['/priva/data-analisys-map/children', element.codDataFlow]);
        }
      },
      (err) => {
        if (err.status == 401) {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.checkIfDataExists(element); }));
        } else {
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }
    )
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
