import { Component, OnInit, ViewChild, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatSort, MatTableDataSource, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { TipoPedidoButton } from 'src/app/models/pedido/tipo-pedido-button';
import { ItemPedidoComponent } from '../item-pedido/item-pedido.component';
import { ListarTituloComponent } from '../listar-titulo/listar-titulo.component';
import { CondicaoPagamento } from 'src/app/models/pedido/condicao-pagamento';
import { Observable } from 'rxjs';
import { startWith, map } from 'rxjs/operators';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ItemPedido } from 'src/app/models/pedido/item-pedido';
import { Pedido } from 'src/app/models/pedido/pedido';
import { Representante } from 'src/app/models/representante/representante';
import { DatePipe } from '@angular/common';
import { Emitente } from 'src/app/models/emitente/emitente';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-copiar-pedido-rapido',
  templateUrl: './copiar-pedido-rapido.component.html',
  styleUrls: ['./copiar-pedido-rapido.component.css']
})
export class CopiarPedidoRapidoComponent implements OnInit {

  pedidoForm: FormGroup;
  tipoPedidoButton = new TipoPedidoButton();
  listaCondicoes: CondicaoPagamento[] = [];
  isLoading: boolean;
  minDate: Date = new Date();

  condicoesFiltradas: Observable<CondicaoPagamento[]>;  

  displayedColumns: string[] = ["codigoItem", "descricaoItem","unidadeMedida","quantidadeItem","precoUnitario","precoTotal","actions"];

  dataSource = new MatTableDataSource([{codigoItem:"IT.10",
                                        descricaoItem:"Produto IT.10",
                                        unidadeMedida:"",
                                        precoTabela:0,
                                        quantidadeItem:10,
                                        precoUnitario:20,
                                        precoTotal:200
                                      },
                                      {codigoItem:"IT.20",
                                        descricaoItem:"Produto IT.20",
                                        unidadeMedida:"",
                                        precoTabela:0,
                                        quantidadeItem:90,
                                        precoUnitario:20,
                                        precoTotal:200
                                      },
                                    ]);

  @ViewChild(MatSort, { static: false }) sort: MatSort;

  constructor(
    private formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<CopiarPedidoRapidoComponent>,
    private dialog: MatDialog,
    private authService: AuthService,
    private pedidoService: PedidoService,
    private snackBar: CustomSnackBarService,
    private datePipe: DatePipe,
    private route: ActivatedRoute, 
    private router: Router,
    @Inject(MAT_DIALOG_DATA) public data: string,
  ) { 
    this.currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  }


  pedido : Pedido;
  currencyFormat:Intl.NumberFormat;

  ngOnInit() {
    this.createForm();



    this.filtraCondicaoPagamento("");
  }

  private createForm() {
    let data = this.dialogRef.componentInstance.data;
    this.isLoading = true;
    this.pedidoForm = this.formBuilder.group({
      codigoUsuario: [this.authService.getLoggedUserId(), ],
      numeroPedidoWeb: [0, Validators.required],
      tipoPedido: [0, Validators.required],
      situacaoPedido: [0,],
      codigoRepresentante: ["", ], 
      codigoEmitente: ["", ],
      titulosVencidos: [0,],
      titulosVencer: [0,],
      cnpj: ["",],
      email: ["",],
      endereco: ["",],
      pedidoCliente: ["",Validators.required],
      dataEmissao: ["",],
      dataEntrega: ["",Validators.required],    
      codigoCondicaoPagamento: ["", Validators.required],
      numeroTabelaPreco: ["",],
      descricaoTabelaPreco: ["",],
      observacoesCliente: ["",],
      observacoesVendedor: ["",],
      rowid: ["", ],     
    });

    this.pedidoForm.disable();

    this.pedidoService.getProximoPedidoWeb().subscribe( response => {
      if(response){
        if(response.erros){
          this.showMessage(response.erros[0].errorDescription, "Error");
        }else if(response.retorno.erros){
          this.showMessage(response.retorno.erros[0].errorDescription, "Error");
        }else{
          this.pedidoForm.controls.numeroPedidoWeb.setValue( response.retorno.pedido[0].numeroPedidoWeb);
          this.pedidoService.getPedido(data).subscribe( response => {
            if(response.erros){
              this.showMessage(response.erros[0].errorDescription, "Error");
            }else if(response.retorno.erros){
              this.showMessage(response.retorno.erros[0].errorDescription, "Error");
            }else{
              this.pedido = response.retorno.pedido[0];
              this.pedidoService.getProximoPedidoCliente(this.pedido.codigoEmitente, this.pedido.tipoPedido).subscribe( response => {
                if(response.erros){
                  this.showMessage(response.erros[0].errorDescription, "Error");
                }else if(response.retorno.erros){
                  this.showMessage(response.retorno.erros[0].errorDescription, "Error");
                }else{
                  this.pedidoForm.controls.pedidoCliente.setValue(response.retorno.pedido[0].numeroPedido);
              
                  this.pedidoForm.controls.codigoUsuario.setValue(this.pedido.codigoUsuarioImplantacao);
                  this.pedidoForm.controls.tipoPedido.setValue(this.pedido.tipoPedido);
                  this.pedidoForm.controls.situacaoPedido.setValue(this.pedido.situacao);
                  let representante = new Representante();
                  representante.codigoRepresentante = this.pedido.codigoRepresentante;
                  representante.nomeRepresentante = this.pedido.nomeRepresentante;
                  this.pedidoForm.controls.codigoRepresentante.setValue(representante);
                  this.pedido.emitente = this.pedido.emitente[0];
                  this.pedidoForm.controls.codigoEmitente.setValue(this.pedido.emitente);
                  this.pedido.emitente.titulosEmitente = this.pedido.emitente.titulosEmitente[0];
                  this.pedidoForm.controls.titulosVencidos.setValue(this.currencyFormat.format(this.pedido.emitente.titulosEmitente.valorVencido));
                  this.pedidoForm.controls.titulosVencer.setValue(this.currencyFormat.format(this.pedido.emitente.titulosEmitente.valorAberto));
                  this.pedidoForm.controls.cnpj.setValue(this.pedido.emitente.cgc);
                  this.pedidoForm.controls.email.setValue(this.pedido.emitente.email);
                  this.pedidoForm.controls.endereco.setValue(this.pedido.emitente.endereco);
                  this.pedidoForm.controls.dataEmissao.setValue(this.datePipe.transform(new Date(), "dd/MM/yyyy"));
                  this.pedidoForm.controls.dataEntrega.enable();
                  this.pedidoForm.controls.observacoesVendedor.enable();
                  let condicaoPagamento = new CondicaoPagamento();
                  condicaoPagamento.codigoCondicaoPagamento = this.pedido.codigoCondicaoPagamento;
                  condicaoPagamento.descricaoCondicaoPagamento = this.pedido.descricaoCondicaoPagamento;
                  this.listaCondicoes.push(condicaoPagamento);


                  this.pedidoForm.controls.codigoCondicaoPagamento.setValue(condicaoPagamento);
                  this.pedidoForm.controls.numeroTabelaPreco.setValue(this.pedido.numeroTabelaPreco);
                  this.pedidoForm.controls.descricaoTabelaPreco.setValue(this.pedido.descricaoTabelaPreco);
                  this.pedidoForm.controls.observacoesCliente.setValue(this.pedido.emitente.observacoes);
                  this.pedidoForm.controls.observacoesVendedor.setValue(this.pedido.observacao);
                  this.dataSource.data = this.pedido.itens;
                  this.isLoading = false;

                }
              });
            }
          });
        }
      }
    });

    

  }

  atualizaQuantidade(indice: number,valor: number)
  {
    var dados = this.dataSource.data;
    dados[indice].quantidadeItem = valor;
    dados[indice].precoTotal = dados[indice].quantidadeItem * dados[indice].precoUnitario;
    this.dataSource.data = dados;
  }

  removerItemPedido(indice: number)
  {
    this.dataSource.data.splice(indice,1);
    this.dataSource.data = this.dataSource.data;
  }

  incluirItemPedido()
  {
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "80%"; 
    const itemPedidoComponent = this.dialog.open(ItemPedidoComponent,dialogConfig);
    itemPedidoComponent.afterClosed().subscribe((result) => {
      if (result!=undefined)
      {
        this.dataSource.data.push(result);
        //this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      }
    });
  }

  abreDetalhesTitulos($event)
  {
    $event.preventDefault();
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "80%";
    const listarTituloComponent = this.dialog.open(ListarTituloComponent,dialogConfig);
    listarTituloComponent.componentInstance.setDataSource(this.pedido.emitente.titulosEmitente.listaTitulos);
  }

  salvarPedido(event)
  {
    event.preventDefault();
    if (this.pedidoForm.valid)
    {

      if( !this.pedido.itens || this.pedido.itens.length == 0 ){
        this.showMessage("É necessário adicionar pelo menos um item ao pedido.", "Warn");
        event.preventDefault();
        return;
      }

      this.pedido.codigoCondicaoPagamento = this.pedidoForm.controls.codigoCondicaoPagamento.value.codigoCondicaoPagamento;
      this.pedido.codigoEmitente = this.pedidoForm.controls.codigoEmitente.value.codigoEmitente;
      this.pedido.codigoRepresentante = this.pedidoForm.controls.codigoRepresentante.value.codigoRepresentante;
      this.pedido.dataEntrega = this.pedidoForm.controls.dataEntrega.value;
      this.pedido.dataEmissao = this.pedidoForm.controls.dataEmissao.value;
      this.pedido.numeroPedido = this.pedidoForm.controls.pedidoCliente.value;
      this.pedido.numeroTabelaPreco = this.pedidoForm.controls.numeroTabelaPreco.value;
      this.pedido.tipoPedido = this.pedidoForm.controls.tipoPedido.value;
      this.pedido.observacao = this.pedidoForm.controls.observacoesVendedor.value;
      this.pedido.codigoUsuarioImplantacao = this.pedidoForm.controls.codigoUsuario.value;
      this.pedido.numeroPedidoWeb = this.pedidoForm.controls.numeroPedidoWeb.value;

      this.pedidoService.savePedido(this.pedido).subscribe( result => {
        if(result.erros || (result.retorno && result.retorno.erros)){
          if (result.erros){
            this.showMessage(result.erros[0].errorDescription, "Error");
          }
          else{
            this.showMessage(result.retorno.erros[0].errorDescription, "Error");
          }
          event.preventDefault();
          return;
        }else{
          this.dialogRef.close();
          this.showMessage(result.ErrMsg);
          this.isLoading = false;
        }
      })
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos.", "Warn");
      event.preventDefault();
    }
  }

  private showMessage(msg: string, type: string = "Success") {
    this.snackBar.openSnackBar(msg, null, type);
  }

  displayCondicaoPagamento(condicao: CondicaoPagamento): string {
    return condicao && condicao.descricaoCondicaoPagamento ?  condicao.descricaoCondicaoPagamento : '';
  }

  filtraCondicaoPagamento(value: string)
  {
    const filterValue = value.toLowerCase();
    this.condicoesFiltradas = this.pedidoForm.controls.codigoCondicaoPagamento.valueChanges.pipe(
      startWith(''),
      map(x => {
        return this.listaCondicoes.filter(option => option.descricaoCondicaoPagamento.toString().trim().toLowerCase().indexOf(filterValue) !== -1);
      })
    );
  }

  displayRepresentante(repres: Representante): string {
    return repres && repres.nomeRepresentante ? repres.nomeRepresentante : '';
  }

  displayEmitente(emitente: Emitente): string {
    return emitente && emitente.descricao ? emitente.descricao : '';
  }

}
