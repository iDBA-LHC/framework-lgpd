import { Component, OnInit, ViewChild } from "@angular/core";
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from "@angular/material";
import { FormaColeta } from "src/app/models/forma-coleta/forma-coleta";
import { AuthService } from "src/app/services/auth.service";
import { ExportPdfService } from "src/app/services/export-pdf.service";
import { FormaColetaService } from "src/app/services/forma-coleta.service";
import { CustomSnackBarService } from "src/app/shared/components/custom-snack-bar/custom-snack-bar.service";
import { TrataExcessaoConexao } from "src/app/shared/utils/trata-excessao-conexao";

@Component({
    selector: 'app-forma-coleta-list',
    templateUrl: './forma-coleta-list.component.html',
    styleUrls: ['./forma-coleta-list.component.css']
})

export class FormaColetaListComponent implements OnInit {
    isLoading = false;

    displayedColumns: string[] = ["nomeFormaColeta", "actions"];

    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;


    constructor(
        private formaColetaService: FormaColetaService,
        private snackBar: CustomSnackBarService,
        private dialog: MatDialog,
        private exportPdfService: ExportPdfService,
        private authService: AuthService
    ) { }

    ngOnInit(): void {
        this.pesquisaFormaColetas();
    }

    pesquisaFormaColetas() {
        this.isLoading = true;
        this.formaColetaService.listaTodasFormaColeta().subscribe(
            (response) => {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<FormaColeta>(response.body);

                setTimeout(() => {
                    this.dataSource.filterPredicate = (
                        data: {
                            nomeFormaColeta: string
                        },
                        filterValue: string
                    ) => data.nomeFormaColeta.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                })
            }, (err) => {
                if (err.status == 401) {
                    TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaFormaColetas();}));
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