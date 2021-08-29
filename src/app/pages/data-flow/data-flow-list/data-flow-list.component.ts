import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
//import { AreaService } from 'src/app/services/area.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { AuthService } from 'src/app/services/auth.service';
import { Area } from 'src/app/models/area/area';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-data-flow-list',
  templateUrl: './data-flow-list.component.html',
  styleUrls: ['./data-flow-list.component.css']
})
export class DataFlowListComponent implements OnInit {

  //isLoading = false;
  //
  //displayedColumns: string[] = ["nomeArea", "nomeEmpresa", "nomeResponsavel", "actions"];
  //
  //dataSource = new MatTableDataSource();
  //@ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  //@ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    //private areaService: AreaService,
    //private snackBar: CustomSnackBarService,
    //private dialog: MatDialog,
    //private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    //this.pesquisaAreas();
    console.log('Carregou DataFlow!!! Wiiii!!')
  }
  /*
    pesquisaAreas() {
      this.isLoading = true;
      this.areaService.listaTodasAreas().subscribe(
        (response) => {
          this.isLoading = false;
          this.dataSource = new MatTableDataSource<Area>(response.body);
          setTimeout(() => {
            this.dataSource.filterPredicate = (
              data: { nomeArea: string,
                      nomeEmpresa: number },
              filterValue: string
            ) => data.nomeArea.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
                 data.nomeEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ;
      
            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;          
          });
        },
        (err) =>{
          if (err.status === 401)
          {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaAreas();}));
          }
          else
          {
            this.isLoading = false;
            TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
          }
        }
      );    
    }
  
    applyFilter(value: string) {
      this.dataSource.filter = value.trim().toLowerCase();
    } */

}
