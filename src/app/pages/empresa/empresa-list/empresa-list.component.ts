import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog } from '@angular/material';
import { EmpresaService } from 'src/app/services/empresa.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { AuthService } from 'src/app/services/auth.service';
import { Empresa } from 'src/app/models/empresa/empresa';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-empresa-list',
  templateUrl: './empresa-list.component.html',
  styleUrls: ['./empresa-list.component.css']
})
export class EmpresaListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["nomeEmpresa", "numeroCNPJ","actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;


  constructor(
    private empresaService: EmpresaService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaEmpresas();
  }

  pesquisaEmpresas() {
    this.isLoading = true;
    this.empresaService.listaTodasEmpresas().subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<Empresa>(response.body);
        setTimeout(() => {
          this.dataSource.filterPredicate = (
            data: { nomeEmpresa: string,
                    numeroCNPJ: number },
            filterValue: string
          ) => data.nomeEmpresa.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
               data.numeroCNPJ.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ;
    
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;          
        });
      },
      (err) =>{
        if (err.status === 401)
        {
          TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaEmpresas();}));
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
