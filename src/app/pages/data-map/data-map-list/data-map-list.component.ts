import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { DataMap } from 'src/app/models/data-map/data-map';
import { AuthService } from 'src/app/services/auth.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-data-map-list',
  templateUrl: './data-map-list.component.html',
  styleUrls: ['./data-map-list.component.css']
})

export class DataMapListComponent implements OnInit {

  isLoading = false;
  indTipo: number;

  displayedColumns: string[] = ["nomeEmpresa", "nomeArea", "nomeProcesso", "nomeAtividade", "dataCompetencia", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private DataMapService: DataMapService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService,
    private router: Router
  ) { }

  ngOnInit() {
    this.indTipo = 0; //Data Map
    this.pesquisaDataMap();
  }

  private pesquisaDataMap() {
    this.isLoading = true;

    if (this.router.url.includes('data-analisys-map')) {
      this.indTipo = 1; //Data Analys Map
    }
    else if (this.router.url.includes('data-governance-map')) {
      this.indTipo = 2; //Data Governance Map
    }

    this.DataMapService.listaTodosDataMap(this.indTipo).subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<DataMap>(response.body);

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
        if (err.status == 401) {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => { this.pesquisaDataMap(); }));
        } else {
          this.isLoading = false;
          TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
      }
    )
  }

  checkIfDataExists(element) {
    this.DataMapService.pesquisaDataMapCicloAtividadeTipo(element.codCicloMonitoramento, element.codAtividade, element.indTipo + 1).subscribe(
      (response) => {
        if (response.body[0]) {
          const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
            data: {
              title: "Já Existe Data Governance Map Cadastrado Para Esta Atividade Neste Ciclo de Monitoramento",
              msg: `Deseja atualizar o Data Governance Map existente?`,
            },
          });

          confirmRemoveDialog.afterClosed().subscribe((result) => {
            if (result) {
              this.router.navigate(['/priva/data-governance-map/children', element.codDataMap, response.body[0].codDataMap]);
            }
          });
        }else{
          this.router.navigate(['/priva/data-governance-map/children', element.codDataMap]);
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
