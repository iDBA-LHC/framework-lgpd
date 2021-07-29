import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { Compartilhamento } from 'src/app/models/compartilhamento/compartilhamento';
import { AuthService } from 'src/app/services/auth.service';
import { CompartilhamentoService } from 'src/app/services/compartilhamento.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-compartilhamento-list',
  templateUrl: './compartilhamento-list.component.html',
  styleUrls: ['./compartilhamento-list.component.css']
})

export class CompartilhamentoListComponent implements OnInit {
  isLoading = false;

  displayedColumns: string[] = ["nomeCompartilhamento", "nomeAplicacao", "nomeModulo", "nomeFornecedor", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private compartilhamentoService: CompartilhamentoService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaCompartilhamentos();
  }

  pesquisaCompartilhamentos() {
    this.isLoading = true;

    this.compartilhamentoService.listarTodosCompartilhamentos().subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<Compartilhamento>(response.body);

        setTimeout(() => {
          this.dataSource.filterPredicate = (
            data: {
              nomeCompartilhamento: string,
              nomeAplicacao: string,
              nomeModulo: string,
              nomeFornecedor: string
            },
            filterValue: string
          ) => data.nomeCompartilhamento.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.nomeAplicacao.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.nomeModulo.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
          data.nomeFornecedor.toString().trim().toLowerCase().indexOf(filterValue) !== -1;
        });
      }, (err) => {
        if (err.status == 401) {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaCompartilhamentos();}));
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
