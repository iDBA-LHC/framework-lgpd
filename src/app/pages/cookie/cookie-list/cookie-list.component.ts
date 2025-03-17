import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './cookie-list.component.html',
  styleUrls: ['./cookie-list.component.css'],

})
export class CookieListComponent implements OnInit {

  isLoading = false;
  mostraInativos = false;

  displayedColumns: string[] = ["formulario", "campo", "tipo", "obrigatorio"];

  jsonData = [
    {
      "formulario": "pg.A4_1of1",
      "campo" : "", 
      "tipo": "text",
      "obrigatorio": "false",
    },
    {
      "formulario": "pg.A4_1of1",
      "campo" : "", 
      "tipo": "email",
      "obrigatorio": "false",
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
  }
}
