import { Component, OnInit, ViewChild, Inject, AfterViewInit } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogRef, MAT_DIALOG_DATA, PageEvent, MatTableModule, MatSortModule } from '@angular/material';
import { PedidoService } from 'src/app/services/pedido.service';
import { Titulo } from 'src/app/models/emitente/titulo';
import { BrowserModule } from '@angular/platform-browser';

@Component({
  selector: 'app-listar-titulo',
  templateUrl: './listar-titulo.component.html',
  styleUrls: ['./listar-titulo.component.css']
})
export class ListarTituloComponent implements OnInit, AfterViewInit {

  isLoading = false;

  displayedColumns: string[] = ["numeroNotaFiscal", "numeroPedido","numeroParcela","dataVencimento","nomeEmitente","valorAberto","valorVencido"];

  dataSource = new MatTableDataSource<Titulo>();
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private pedidoService:PedidoService,
    public dialogRef: MatDialogRef<ListarTituloComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Titulo
  ) {}

  ngOnInit() {
    this.isLoading = true;   
  }

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  length = 0;
  pageSize = 10;
  pageSizeOptions: number[] = [5, 10];
  pageIndex = 0;
  listaTitulos:Titulo[];
  listaTitulosFiltrado:Titulo[];

  setPageSizeOptions(setPageSizeOptionsInput: string) {
    if (setPageSizeOptionsInput) {
      this.pageSizeOptions = setPageSizeOptionsInput.split(',').map(str => +str);
    }
  }

  setDataSource(listaTitulos: Titulo[]){
    this.listaTitulos = listaTitulos;
    this.listaTitulosFiltrado = this.listaTitulos;
    this.length = listaTitulos.length;
    this.paginateDataSource();
  }

  pageEvent(pageEvent: PageEvent){
    this.pageSize  = pageEvent.pageSize;
    this.pageIndex = pageEvent.pageIndex;
    this.paginateDataSource();
  }

  paginateDataSource(){
    this.dataSource.data = this.listaTitulosFiltrado.slice(this.pageIndex * this.pageSize, (this.pageIndex * this.pageSize) + this.pageSize - 1 ); 
    this.length = this.listaTitulosFiltrado.length;
  }

  applyFilter(filtro: string){
    this.listaTitulosFiltrado = this.listaTitulos.filter( titulo => titulo.numeroNotaFiscal.match(filtro) || titulo.numeroPedido.match(filtro));
    this.pageIndex = 0;
    this.paginateDataSource();
    this.paginator.firstPage();
  }

}
