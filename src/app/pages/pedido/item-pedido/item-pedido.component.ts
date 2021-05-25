import { Component, OnInit, Inject, ViewChild, AfterViewInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog, MatTableDataSource, MatDialogConfig, MatPaginator, MatSort } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ItemPedido } from 'src/app/models/pedido/item-pedido';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ItemListaPreco } from 'src/app/models/pedido/item-lista-preco';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AplicacaoItem } from 'src/app/models/pedido/aplicacao-item';
import { AplicacaoItemPedidoComponent } from '../aplicacao-item-pedido/aplicacao-item-pedido.component';
import { AplicacaoItemPedido } from 'src/app/models/pedido/aplicacao-item-pedido';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { AplicacaoService } from 'src/app/services/aplicacao.service';

@Component({
  selector: 'app-item-pedido',
  templateUrl: './item-pedido.component.html',
  styleUrls: ['./item-pedido.component.css']
})
export class ItemPedidoComponent implements OnInit, AfterViewInit {
  itemPedidoForm: FormGroup;
  editando: boolean = false;
  visualizando = false;
  displayedColumns: string[] = ["descricaoAplicacao","percentual","actions"];

  dataSourceAplicacao = new MatTableDataSource<AplicacaoItem>();

  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;  

  listaItemListaPreco: ItemListaPreco[];
  listaAplicacaoItem: AplicacaoItem[];
  listaAplicacaoItemFiltrado: AplicacaoItem[];

  itemListaPrecoFiltrado : Observable<ItemListaPreco[]>;
  
  constructor(
    public dialogRef: MatDialogRef<ItemPedidoComponent>,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: CustomSnackBarService,
    private aplicacaoService: AplicacaoService,
    @Inject(MAT_DIALOG_DATA) public data: ItemPedido
  ) {}


  filtraItensListaPreco(value: string)
  {
    const filterValue = value.toLowerCase();
    this.itemListaPrecoFiltrado = this.itemPedidoForm.controls.descricaoItem.valueChanges.pipe(
      startWith(''),
      map(x => {
        return this.listaItemListaPreco ? this.listaItemListaPreco.filter(option => option.filtro.toString().trim().toLowerCase().indexOf(filterValue) !== -1) : [];
      })
    );
  }


  ngOnInit() {
    
    this.data = this.dialogRef.componentInstance.data;
    if(this.data.aplicacoes){
      this.data.aplicacoes.forEach(val => this.dataSourceAplicacao.data.push(Object.assign({}, val)));
    }else{
      this.dataSourceAplicacao.data = new Array<AplicacaoItem>();
      this.data.aplicacoes = new Array<AplicacaoItem>();
    }
    
    this.createForm();

    if(this.visualizando){
      this.itemPedidoForm.controls.item.setValue(this.data.codigoItem);
      this.itemPedidoForm.controls.codigoItem.setValue(this.data.codigoItem);
      this.itemPedidoForm.controls.descricaoItem.setValue(`${this.data.codigoItem} - ${this.data.descricaoItem}`);
      this.itemPedidoForm.controls.unidadeMedida.setValue(this.data.unidadeMedida);
      this.itemPedidoForm.controls.precoTabela.setValue(this.data.precoTabela);
      this.itemPedidoForm.controls.quantidadeItem.setValue(this.data.quantidadeItem);
      this.itemPedidoForm.controls.precoUnitario.setValue(this.data.precoUnitario);
      this.itemPedidoForm.controls.precoTotal.setValue(this.data.precoTotal);
      this.itemPedidoForm.controls.indBonificado.setValue(this.data.tipoPedido == 3 ? 1 : 0);
    }

    if (this.editando)
    {            
        var itemListaPreco:ItemListaPreco = this.listaItemListaPreco.find(e => e.codigoItem === this.data.codigoItem);

        this.itemPedidoForm.patchValue({         
                item: itemListaPreco,
                codigoItem: this.data.codigoItem,
                descricaoItem: this.data.descricaoItem,
                unidadeMedida: this.data.unidadeMedida,
                precoTabela: this.data.precoTabela,
                quantidadeItem: this.data.quantidadeItem,
                precoUnitario: this.data.precoUnitario,
                precoTotal: this.data.precoTotal,
                indBonificado: this.data.indBonificado
              });
        if(this.data.tipoPedido == 3){
          this.itemPedidoForm.controls.indBonificado.setValue(1);
        }
       
    }

    this.aplicacaoService.getAplicacoes().subscribe( retorno => {
      this.listaAplicacaoItem = retorno.retorno.aplicacoesItem;
    } );
  }

  ngAfterViewInit(){
    this.calculateTotal();
  }

  private enableForm(){
    this.itemPedidoForm.controls.indBonificado.enable();
    this.itemPedidoForm.controls.quantidadeItem.enable();
    this.itemPedidoForm.controls.precoUnitario.enable();
  }

  private createForm() {
    this.itemPedidoForm = this.formBuilder.group({
      item: [ItemListaPreco, Validators.required] ,      
      codigoItem: ["", ],
      descricaoItem: ["", ],
      unidadeMedida: ["", ],
      precoTabela: [0, ],
      quantidadeItem: [0, [Validators.required, Validators.pattern('^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$')] ],
      precoUnitario: [0, [Validators.required, Validators.pattern('^(0*[1-9][0-9]*(\.[0-9]+)?|0+\.[0-9]*[1-9][0-9]*)$')] ],
      precoTotal: [0, ],
      indBonificado: [0,]
    });
    this.itemPedidoForm.disable();
    if (!this.visualizando){
      this.itemPedidoForm.controls.item.enable();

      this.itemPedidoForm.controls.item.valueChanges.subscribe(value => {
        if(value != null){
          let item : ItemListaPreco = this.listaItemListaPreco.find( item => item.codigoItem == this.itemPedidoForm.controls.item.value.codigoItem);
          if(!item){
            this.itemPedidoForm.controls.item.setErrors( {required: true } );
          }else{
            this.enableForm();
          }
        }
      });
    }
  }

  incluirAplicacao()
  {
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "80%"; 
    let aplicacaoItemPedidoComponent = this.dialog.open(AplicacaoItemPedidoComponent,dialogConfig);
    aplicacaoItemPedidoComponent.componentInstance.codigoItem = this.itemPedidoForm.controls.codigoItem.value;

    this.listaAplicacaoItemFiltrado = [];
    this.listaAplicacaoItem.forEach( val => { this.listaAplicacaoItemFiltrado.push(new AplicacaoItem(val.codigoAplicacao, val.descricaoAplicacao))});

    this.dataSourceAplicacao.data.forEach( (aplicacaoItem, indexItem) => {
      this.listaAplicacaoItemFiltrado.forEach( (aplicacao, index) => {

        if( aplicacaoItem.codigoAplicacao == aplicacao.codigoAplicacao ){
          this.listaAplicacaoItemFiltrado.splice(index, 1);
        }
      });
    });  

    aplicacaoItemPedidoComponent.componentInstance.listaAplicacaoItem = this.listaAplicacaoItemFiltrado;
    aplicacaoItemPedidoComponent.afterClosed().subscribe((result) => {
      if (result!=undefined)
      {
        this.data.aplicacoes.push(result);
        this.dataSourceAplicacao.data = this.data.aplicacoes;
        this.dataSourceAplicacao.paginator = this.paginator;
        this.dataSourceAplicacao.sort = this.sort;       
      }
    });
  }

  removerAplicacaoItemPedido(aplicacaoItemPedido: AplicacaoItemPedido,$event)
  {
    $event.preventDefault();

    let descricaoAplicacao = "";
    if (aplicacaoItemPedido.descricaoAplicacao.length != 0){
      descricaoAplicacao = aplicacaoItemPedido.descricaoAplicacao;
    }else{
      this.listaAplicacaoItem.find( aplicacao => { 
        if(aplicacao.codigoAplicacao == aplicacaoItemPedido.codigoAplicacao){
          descricaoAplicacao = aplicacao.descricaoAplicacao
        }
      });
    }

    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar exclusão de Aplicação",
        msg: `Tem certeza que deseja prosseguir com a exclusão da aplicação ${descricaoAplicacao}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        let indexAplicacao = -1;
        this.dataSourceAplicacao.data.find( (aplicacao, index) => {
          if (aplicacao.codigoAplicacao == aplicacaoItemPedido.codigoAplicacao){
            indexAplicacao = index;
          }
        });

        if(indexAplicacao >= 0){
          this.dataSourceAplicacao.data.splice(indexAplicacao,1);
          this.dataSourceAplicacao.data = this.dataSourceAplicacao.data;
        }
      }
    });
  }

  salvarItemPedido()
  {
    if (this.itemPedidoForm.valid) {

      let totalAplicacoes:number = 0;
      this.dataSourceAplicacao.data.forEach(aplicacao => {
        totalAplicacoes += Number(aplicacao.percentual)
      }
        
      );
      if (totalAplicacoes != 100){
        this.showMessage("Aplicações informadas devem totalizar 100%.", "Warn");
      }else{
        const itemPedido: ItemPedido = this.itemPedidoForm.getRawValue();
        itemPedido.codigoItem = this.itemPedidoForm.controls.item.value.codigoItem;
        itemPedido.descricaoItem = this.itemPedidoForm.controls.item.value.descricaoItem;
        this.data.aplicacoes = this.dataSourceAplicacao.data;
        this.data.codigoItem = itemPedido.codigoItem;
        this.data.descricaoItem = itemPedido.descricaoItem;
        this.data.unidadeMedida = itemPedido.unidadeMedida;
        this.data.sequenciaItem = itemPedido.sequenciaItem;
        this.data.sequenciaPedido = itemPedido.sequenciaPedido;
        this.data.quantidadeItem = itemPedido.quantidadeItem;
        this.data.precoUnitario = itemPedido.precoUnitario;
        this.data.precoTotal = itemPedido.precoTotal;
        this.data.tipoPedido = itemPedido.tipoPedido;
        this.data.indBonificado = itemPedido.indBonificado;
        this.dialogRef.close(this.data);
      }
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos.", "Warn");
    }
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

  private filtraItens(value: string): ItemListaPreco[] {
    const filterValue = value.toLowerCase();
    return this.listaItemListaPreco.filter(item => item.filtro.trim().toLowerCase().includes(filterValue));
  }

  displayItem(item: ItemListaPreco): string {
    return item && item.filtro ? item.filtro : '';
  }

  setItemInformations(item: ItemListaPreco){
    this.itemPedidoForm.controls.unidadeMedida.setValue(item.unidadeMedida);
    this.itemPedidoForm.controls.precoTabela.setValue(item.precoVenda);
    this.itemPedidoForm.controls.precoUnitario.setValue(item.precoVenda);
  }

  calculateTotal(){
    let precoTotal = this.itemPedidoForm.controls.precoUnitario.value * this.itemPedidoForm.controls.quantidadeItem.value;
    precoTotal = parseFloat(precoTotal.toFixed(2));
    this.itemPedidoForm.controls.precoTotal.setValue(precoTotal);
  }

  setValues(itemPedido: ItemPedido){
    let itemListaPreco = new ItemListaPreco();
    itemListaPreco.filtro = itemPedido.codigoItem + " - " + itemPedido.descricaoItem;
    itemListaPreco.codigoItem = itemPedido.codigoItem;
    itemListaPreco.descricaoItem = itemPedido.descricaoItem;
    itemListaPreco.unidadeMedida = itemPedido.unidadeMedida
    itemListaPreco.precoVenda = itemPedido.precoTabela
    this.itemPedidoForm.controls.item.setValue(itemListaPreco);
  }

}
