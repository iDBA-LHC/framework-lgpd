import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Area } from 'src/app/models/area/area';
import { AreaService } from 'src/app/services/area.service';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-area-list',
  templateUrl: './area-list.component.html',
  styleUrls: ['./area-list.component.css']
})
export class AreaListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["nomeEmpresa", "nomeArea", "nomeResponsavel", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    private areaService: AreaService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaAreas();
  }

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
  }

}
