import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatPaginator, MatSort, MatTableDataSource } from '@angular/material';
import { AuthService } from 'src/app/services/auth.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { BaseLegalService } from 'src/app/services/base-legal.service';
import { BaseLegal } from 'src/app/models/base-legal/base-legal';
import { TrataExcessaoConexao } from 'src/app/shared/utils/trata-excessao-conexao';

@Component({
    selector: 'app-base-legal-list',
    templateUrl: './base-legal-list.component.html',
    styleUrls: ['./base-legal-list.component.css']
})

export class BaseLegalListComponent implements OnInit {
    isLoading = false;

    displayedColumns: string[] = ["nomeBase", "actions"];

    dataSource = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort, { static: false }) sort: MatSort;


    constructor(
        private baseLegalService: BaseLegalService,
        private snackBar: CustomSnackBarService,
        private dialog: MatDialog,
        private exportPdfService: ExportPdfService,
        private authService: AuthService
    ) { }


    ngOnInit(): void {
        this.pesquisaBasesLegais();
    }

    pesquisaBasesLegais() {
        this.isLoading = true;
        this.baseLegalService.listaTodasBasesLegais().subscribe(
            (response) => {
                this.isLoading = false;
                this.dataSource = new MatTableDataSource<BaseLegal>(response.body);
                
                setTimeout(() => {
                    this.dataSource.filterPredicate = (
                        data: {
                            nomeBase: string
                        },
                        filterValue: string
                    ) => data.nomeBase.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

                    this.dataSource.paginator = this.paginator;
                    this.dataSource.sort = this.sort;
                });
            },
            (err) => {
                if (err.status == 401) {
                    TrataExcessaoConexao.TrataErroAutenticacao(err, this.snackBar, this.authService.renewSession(() => {this.pesquisaBasesLegais();}));
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