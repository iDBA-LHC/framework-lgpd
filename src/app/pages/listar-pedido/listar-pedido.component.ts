import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { MatTableDataSource, MatPaginator, MatSort, MatDialogConfig, MatDialog } from '@angular/material';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ExportPdfService } from 'src/app/services/export-pdf.service';
import { CopiarPedidoRapidoComponent } from '../pedido/copiar-pedido-rapido/copiar-pedido-rapido.component';
import { Pedido } from 'src/app/models/pedido/pedido';
import { ScrollStrategyOptions } from '@angular/cdk/overlay';
import { PedidoService } from 'src/app/services/pedido.service';
import { DatePipe } from '@angular/common';
import { options } from 'src/app/app.module';
import { FormBuilder, FormGroup } from '@angular/forms';
import { PedidoComponent } from '../pedido/pedido.component';
import {SESSION_STORAGE, WebStorageService} from 'angular-webstorage-service';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';

@Component({
  selector: 'app-listar-pedido',
  templateUrl: './listar-pedido.component.html',
  styleUrls: ['./listar-pedido.component.css']
})
export class ListarPedidoComponent implements OnInit {
  isLoading = false;

  displayedColumns: string[] = ["codigoCliente", "razaoSocial","dataEmissao","numeroPedido","notasFiscais","status","situacao","valorTotal","dataEntrega","actions"];
  statusPedidoOptions: any[];
  statusSelected: Number = 0;
  situacaoSelected: Number = 0;
  situacaoPedidoOptions: any[];
  pedidoForm: FormGroup;

  dataSource = new MatTableDataSource<Pedido>();
  listaPedidos : Pedido[];
  listaPedidosFiltrados : Pedido[];

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });

  constructor(
    private snackBar: CustomSnackBarService,
    private exportPdfService: ExportPdfService,
    private dialog: MatDialog,
    private pedidoService: PedidoService,
    private datePipe: DatePipe,
    private formBuilder: FormBuilder,
    @Inject(SESSION_STORAGE) private storage: WebStorageService
  ) { 

    
  }

  private createForm() {
    let dataEmissaoIniValue = new Date();
    dataEmissaoIniValue.setMonth( dataEmissaoIniValue.getMonth() - 1);

    this.pedidoForm = this.formBuilder.group({  
      statusPedido: [0],
      situacaoPedido: [0],
      numeroPedido: [""],
      cliente: [""],
      dataEmissaoIni: [dataEmissaoIniValue],
      dataEmissaoFim: [""],
    });

    let filtro = this.getFromSession("filtroConsultaPedidos");
    if(filtro){
      this.pedidoForm.controls.statusPedido.setValue(filtro.statusPedido);
      this.pedidoForm.controls.situacaoPedido.setValue(filtro.situacaoPedido);
      this.pedidoForm.controls.numeroPedido.setValue(filtro.numeroPedido);
      this.pedidoForm.controls.cliente.setValue(filtro.cliente);
      this.pedidoForm.controls.dataEmissaoIni.setValue(filtro.dataEmissaoIni);
      this.pedidoForm.controls.dataEmissaoFim.setValue(filtro.dataEmissaoFim);
    }

  }

  ngOnInit() {
    let divTop = document.getElementById('top');
    if(divTop){
      divTop.scrollIntoView();
    }
    this.situacaoPedidoOptions = [];
    this.situacaoPedidoOptions.push({cod: 0, descricao: "Todos"});
    this.situacaoPedidoOptions.push({cod: 1, descricao: "Digitado"});
    this.situacaoPedidoOptions.push({cod: 2, descricao: "Enviado"});
    this.situacaoPedidoOptions.push({cod: 3, descricao: "Com Erro"});
    this.situacaoPedidoOptions.push({cod: 4, descricao: "Integrado"});

    this.statusPedidoOptions = [];
    this.statusPedidoOptions.push({cod: 0, descricao: "Todos"});
    this.statusPedidoOptions.push({cod: 1, descricao: "Não Implantado"});
    this.statusPedidoOptions.push({cod: 2, descricao: "Implantado"});
    this.statusPedidoOptions.push({cod: 3, descricao: "Em Análise"});
    this.statusPedidoOptions.push({cod: 4, descricao: "Liberado para Faturamento"});
    this.statusPedidoOptions.push({cod: 5, descricao: "Em Separação"});
    this.statusPedidoOptions.push({cod: 6, descricao: "Faturado"});

    this.createForm();

    this.pesquisarPedidos(true);
    
  }

 dateToString( pDate : Date ){
    return this.datePipe.transform(pDate, "dd/MM/yyyy");
  }

  numberToCurrency(pNumber : number){
    return this.currencyFormat.format(pNumber);
  }

  copiarPedidoFacil(pedido: Pedido)
  {
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "95%";
    dialogConfig.width = "95%";
    dialogConfig.data = pedido.rowid;
    const copiarPedidoRapidoComponent = this.dialog.open(CopiarPedidoRapidoComponent,dialogConfig);
    copiarPedidoRapidoComponent.afterClosed().subscribe((result) => {
      this.pesquisarPedidos();
    });
    
  }  

  removerPedido(pedido: Pedido)
  {

    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar exclusão do Pedido",
        msg: `Tem certeza que deseja prosseguir com a exclusão do pedido ${pedido.numeroPedido}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.pedidoService.deletePedido(pedido.rowid).subscribe( response => {
          if(response){
            if(response.erros){
              this.snackBar.openSnackBar(response.erros[0].errorDescription, null, "Error");
            }else if(response.retorno.erros){
              this.snackBar.openSnackBar(response.retorno.erros[0].errorDescription, null, "Error");
            }else if(response.ErrMsg){
              this.snackBar.openSnackBar(response.ErrMsg, null);
              this.pesquisarPedidos();
            }
          }
        });
      }
    });
  }

  pesquisarPedidos(isFirst=false){
    this.isLoading = true;
    let filtro = {};
    filtro['statusPedido'] = this.pedidoForm.controls.statusPedido.value;
    filtro['situacaoPedido'] = this.pedidoForm.controls.situacaoPedido.value;
    filtro['numeroPedido'] = this.pedidoForm.controls.numeroPedido.value;
    filtro['cliente'] = this.pedidoForm.controls.cliente.value;
    filtro['dataEmissaoIni'] = this.pedidoForm.controls.dataEmissaoIni.value;
    filtro['dataEmissaoFim'] = this.pedidoForm.controls.dataEmissaoFim.value; 

    this.listaPedidos = this.getFromSession("resultadoConsultaPedidos");
    if(isFirst && this.listaPedidos){
      this.dataSource.data      = this.listaPedidos
      this.dataSource.sort      = this.sort;
      this.dataSource.paginator = this.paginator;
    }

    this.pedidoService.getPedidos(filtro).subscribe( retorno => {
      this.saveInSession("filtroConsultaPedidos", filtro);
      if (retorno.retorno.pedido){
        this.listaPedidos         = retorno.retorno.pedido; 
        this.dataSource.data      = retorno.retorno.pedido;
        this.dataSource.sort      = this.sort;
        this.dataSource.paginator = this.paginator;
        this.saveInSession("resultadoConsultaPedidos", this.listaPedidos);
      }else{
        this.dataSource.data = [];
        this.listaPedidos = null;
      }
      this.isLoading = false;
    });
  }

  applyFilter(filtro: string){
    filtro = filtro.toLowerCase();
    if(this.listaPedidos){
      this.listaPedidosFiltrados = this.listaPedidos.filter( pedido => 
        (pedido.codigoEmitente.toString() && pedido.codigoEmitente.toString().match(filtro)) || 
        (pedido.razaoSocial.toLowerCase() && pedido.razaoSocial.toLowerCase().match(filtro)) ||
        (pedido.numeroPedido.toLowerCase() && pedido.numeroPedido.toLowerCase().match(filtro)) ||
        (pedido.notasFiscais && pedido.notasFiscais.match(filtro))
      );
      this.dataSource.data = this.listaPedidosFiltrados;
    }
  }

  saveInSession(key, val): void {
    this.storage.set(key, val);
  }

  getFromSession(key): any {
    return this.storage.get(key);  
   }
}
