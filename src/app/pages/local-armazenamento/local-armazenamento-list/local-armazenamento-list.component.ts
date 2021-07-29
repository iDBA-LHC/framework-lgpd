import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { LocalArmazenamento } from 'src/app/models/local-armazenamento/local-armazenamento';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { LocalArmazenamentoService } from 'src/app/services/local-armazenamento.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-local-armazenamento-list',
  templateUrl: './local-armazenamento-list.component.html',
  styleUrls: ['./local-armazenamento-list.component.css']
})

export class LocalArmazenamentoListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["nomeLocalArmazenamento", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private localArmazenamentoService: LocalArmazenamentoService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaLocaisArmazenamento();
  }

  private pesquisaLocaisArmazenamento() {
    this.isLoading = true;
    this.localArmazenamentoService.listaTodosLocaisArmazenamento().subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<LocalArmazenamento>(response.body);
        
        setTimeout(() => {
            this.dataSource.filterPredicate = (
                data: {
                    nomeLocalArmazenamento: string
                },
                filterValue: string
            ) => data.nomeLocalArmazenamento.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    },
    (err) => {
        if (err.status == 401) {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaLocaisArmazenamento();}));
        } else {
            this.isLoading = false;
            TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
    }
    )
  }

}
