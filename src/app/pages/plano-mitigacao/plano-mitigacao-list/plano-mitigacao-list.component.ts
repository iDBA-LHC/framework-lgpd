import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { PlanoMitigacao } from 'src/app/models/plano-mitigacao/plano-mitigacao';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { PlanoMitigacaoService } from 'src/app/services/plano-mitigacao.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
  selector: 'app-plano-mitigacao-list',
  templateUrl: './plano-mitigacao-list.component.html',
  styleUrls: ['./plano-mitigacao-list.component.css']
})

export class PlanoMitigacaoListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["desPlanoMitigacao", "actions"];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private PlanoMitigacaoService: PlanoMitigacaoService,
    private snackBar: CustomSnackBarService,
    private dialog: MatDialog,
    private exportPdfService: ExportPdfService,
    private authService: AuthService
  ) { }

  ngOnInit() {
    this.pesquisaPlanoMitigacao();
  }

  private pesquisaPlanoMitigacao() {
    this.isLoading = true;
    this.PlanoMitigacaoService.listaTodosPlanoMitigacao().subscribe(
      (response) => {
        this.isLoading = false;
        this.dataSource = new MatTableDataSource<PlanoMitigacao>(response.body);
        
        setTimeout(() => {
            this.dataSource.filterPredicate = (
                data: {
                    codPlanoMitigacao: string
                },
                filterValue: string
            ) => data.codPlanoMitigacao.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

            this.dataSource.paginator = this.paginator;
            this.dataSource.sort = this.sort;
        });
    },
    (err) => {
        if (err.status == 401) {
            TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaPlanoMitigacao();}));
        } else {
            this.isLoading = false;
            TrataExcessaoConexao.TrataExcessao(err, this.snackBar);
        }
    }
    )
  }

}
