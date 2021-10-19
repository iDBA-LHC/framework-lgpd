import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Router } from '@angular/router';
import { DataMap } from 'src/app/models/data-map/data-map';
import { AuthService } from 'src/app/services/auth.service';
import { DataMapService } from 'src/app/services/data-map.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-data-map-list',
  templateUrl: './data-map-list.component.html',
  styleUrls: ['./data-map-list.component.css']
})

export class DataMapListComponent implements OnInit {

  isLoading = false;
  indTipo : number;

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
	this.indTipo = 0;
    this.pesquisaDataMap();
  }

  private pesquisaDataMap() {
    this.isLoading = true;
	
	if (this.router.url.includes('data-analisys-map')) {
		this.indTipo = 1;
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
            ) =>  data.nomeEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
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
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaDataMap();}));
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
