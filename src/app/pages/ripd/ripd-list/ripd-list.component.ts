import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-ripd-list',
  templateUrl: './ripd-list.component.html',
  styleUrls: ['./ripd-list.component.css'],

})
export class RIPDListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["versao", "geracao", "usuario"];
  checkedColumns: string[] = [];

  jsonData = [
    {
      "versao": "1.0.0",
      "geracao": "20/12/2023",
      "usuario": "usuário 1"
    },
    {
      "versao": "1.0.1",
      "geracao": "01/01/2024",
      "usuario": "usuário 2"
    },
    {
      "versao": "1.0.2",
      "geracao": "15/01/2024",
      "usuario": "usuário 4"
    },
  ];

  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  ngOnInit(): void {
    this.carregarDados();
  }

  carregarDados() {
    this.dataSource.data = this.jsonData;
    this.dataSource.filterPredicate = (
      data: {
        versao: string,
        geracao: string,
        usuario: string
      },
      filterValue: string
    ) => data.usuario.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.versao.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.geracao.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

}
