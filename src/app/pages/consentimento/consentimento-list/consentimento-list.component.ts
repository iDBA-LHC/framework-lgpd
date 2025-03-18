import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'consentimento-list',
  templateUrl: './consentimento-list.component.html',
  styleUrls: ['./consentimento-list.component.css'],

})
export class ConsentimentoListComponent implements OnInit {

  isLoading = false;

  displayedColumns: string[] = ["usuario", "email", "dataHora", "acao", "area"];

  jsonData = [
    {
      "usuario": "usuario 1",
      "email": "email",
      "dataHora": "Data / hora",
      "acao": "Consentiu",
      "area": "RH"
    },
    {
      "usuario": "usuario 2",
      "email": "email",
      "dataHora": "Data / hora",
      "acao": "Revogação",
      "area": "Marketing"
    },
    {
      "usuario": "usuario 3",
      "email": "email",
      "dataHora": "Data / hora",
      "acao": "Consentiu",
      "area": "Medicina Trabalho"
    }
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
        usuario: string,
        email: string,
        dataHora: string,
        acao: string,
        area: string
      },
      filterValue: string
    ) => data.usuario.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.email.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.dataHora.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
        data.acao.toString().trim().toLowerCase().indexOf(filterValue) !== -1||
        data.area.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }
}
