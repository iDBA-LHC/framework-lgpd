import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator, MatTableDataSource, MatSort, MatDialog } from '@angular/material';

@Component({
  selector: 'app-usuario-list',
  templateUrl: './ripd-list.component.html',
  styleUrls: ['./ripd-list.component.css'],

})
export class RIPDListComponent implements OnInit {

  isLoading = false;
  mostraInativos = false;

  displayedColumns: string[] = ["check", "coluna1", "criado", "excluir"];
  checkedColumns: string[] = [];

  jsonData = [
    {
      "coluna1": "RIPD1",
      "criado": "23/09/2021",
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
    // arrumar filtro
    // this.dataSource.filterPredicate = (
    //   data: {
    //     usuario: string,
    //     email: string,
    //     dataHora: string,
    //     acao: string,
    //     area: string
    //   },
    //   filterValue: string
    // ) => data.usuario.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
    //     data.email.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
    //     data.dataHora.toString().trim().toLowerCase().indexOf(filterValue) !== -1 ||
    //     data.acao.toString().trim().toLowerCase().indexOf(filterValue) !== -1||
    //     data.area.toString().trim().toLowerCase().indexOf(filterValue) !== -1;

    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(value: string) {
    this.dataSource.filter = value.trim().toLowerCase();
  }

  isChecked(coluna1: string) {
    return this.checkedColumns.includes(coluna1)
  }

  handleClickColumn(coluna1: string) {
    if (this.checkedColumns.includes(coluna1)) {
      const index = this.checkedColumns.findIndex(el => el === coluna1)
      this.checkedColumns.splice(index, 1)
    } else {
      this.checkedColumns.push(coluna1)
    }
  }

  downloadRelatorio() {
    const filePath = `assets/docs/PRIVA-Template-RIPD.pdf`;
    const link = document.createElement('a');
    link.href = filePath;
    link.download = "PRIVA-Template-RIPD.pdf";
    link.click();
  }
}
