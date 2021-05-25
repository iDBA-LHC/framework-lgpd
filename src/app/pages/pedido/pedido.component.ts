import { Component, OnInit, ViewChild, Inject, AfterViewInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { TipoPedidoButton } from 'src/app/models/pedido/tipo-pedido-button';
import { MatTableDataSource, MatPaginator, MatSort, MatDialog, MatDialogConfig, MatOptionSelectionChange, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { ItemPedidoComponent } from './item-pedido/item-pedido.component';
import { ItemPedido } from 'src/app/models/pedido/item-pedido';
import { ListarTituloComponent } from './listar-titulo/listar-titulo.component';
import { Observable } from 'rxjs';
import { startWith, map, repeat } from 'rxjs/operators';
import { CondicaoPagamento } from 'src/app/models/pedido/condicao-pagamento';
import { Representante } from 'src/app/models/representante/representante';
import { Emitente } from 'src/app/models/emitente/emitente';
import { CustomSnackBarService } from 'src/app/shared/components/custom-snack-bar/custom-snack-bar.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Pedido } from 'src/app/models/pedido/pedido';
import { ConfirmModalComponent } from 'src/app/shared/components/confirm-modal/confirm-modal.component';
import { RepresentanteService } from 'src/app/services/representante.service';
import { EmitenteService } from 'src/app/services/emitente.service';
import { AuthService } from 'src/app/services/auth.service';
import { PedidoService } from 'src/app/services/pedido.service';
import { ItemListaPreco } from 'src/app/models/pedido/item-lista-preco';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-pedido',
  templateUrl: './pedido.component.html',
  styleUrls: ['./pedido.component.css']
})

export class PedidoComponent implements OnInit {

  currencyFormat:Intl.NumberFormat;

  constructor(
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    private snackBar: CustomSnackBarService,
    private router: Router,
    private pedidoService: PedidoService,
    private representanteService: RepresentanteService,
    private emitenteService: EmitenteService,
    private authService: AuthService,
    public pedido : Pedido,
    private datePipe: DatePipe,
  ) { 
    this.currencyFormat = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  isLoading = false;
  visualizando = false;
  copiando = false;
  listaRepresentantes: Representante[];
  listaEmitentes: Emitente[];
  listaCondicoes: CondicaoPagamento [] = [];
  listaItemListaPreco: ItemListaPreco[] = [];
  minDate: Date = new Date();
  i = 0;
  disabled = false;

  represantantesFiltrados: Observable<Representante[]>;
  emitentesFiltrados: Observable<Emitente[]>;
  condicoesFiltradas: Observable<CondicaoPagamento[]>;
  pedidoSelecionado: Pedido;
  pedidoId: String;
  pedidoForm: FormGroup;
  displayedColumns: string[] = ["codigoItem", "descricaoItem","unidadeMedida","quantidadeItem","precoUnitario","precoTotal","actions"];

  dataSource = new MatTableDataSource<ItemPedido>();                                      
  
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild(MatSort, { static: false }) sort: MatSort;

  tipoPedidoButton = new TipoPedidoButton();

  ngOnInit() {    
    let divTop = document.getElementById('top');
    if(divTop){
      divTop.scrollIntoView();
    }

    this.isLoading = true;

    if (this.router.url.indexOf("copiar")!=-1){
      this.copiando = true;
    }

    this.activatedRoute.params.subscribe( data => {
      if (data["id?"]) {
        this.pedidoId = data["id?"];
        if(!this.copiando){
          this.visualizando = true;
        }
      }
    });
  

    this.createForm(); 

    if (this.visualizando || this.copiando)
    {
      this.pedidoForm.disable();
      this.pedidoService.getPedido(this.pedidoId).subscribe(dataResponse => {
        this.pedido = dataResponse.retorno.pedido[0];
        
        this.pedidoForm.controls.codigoUsuario.setValue(this.pedido.codigoUsuarioImplantacao);
        this.pedidoForm.controls.numeroPedidoWeb.setValue(this.pedido.numeroPedidoWeb);
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
        this.pedidoForm.controls.pedidoCliente.setValue(this.pedido.numeroPedido);
        this.pedidoForm.controls.dataEmissao.setValue(this.datePipe.transform(this.pedido.dataEmissao, "dd/MM/yyyy"));
        this.pedidoForm.controls.dataEntrega.setValue(this.datePipe.transform(this.pedido.dataEntrega, "dd/MM/yyyy"));
        let condicaoPagamento = new CondicaoPagamento();
        condicaoPagamento.codigoCondicaoPagamento = this.pedido.codigoCondicaoPagamento;
        condicaoPagamento.descricaoCondicaoPagamento = this.pedido.descricaoCondicaoPagamento;
        this.pedidoForm.controls.codigoCondicaoPagamento.setValue(condicaoPagamento);
        this.pedidoForm.controls.numeroTabelaPreco.setValue(this.pedido.numeroTabelaPreco);
        this.pedidoForm.controls.descricaoTabelaPreco.setValue(this.pedido.descricaoTabelaPreco);
        this.pedidoForm.controls.observacoesCliente.setValue(this.pedido.emitente.observacoes);
        this.pedidoForm.controls.observacoesVendedor.setValue(this.pedido.observacao);
        this.pedidoForm.controls.observacoesVendedor.enable();
        this.dataSource.data = this.pedido.itens;

        if(this.visualizando){
          this.isLoading = false;
          this.pedidoForm.controls.dataEntrega.enable();
          
          
          //Ajuse de data, pois estava ficando com um dia a menos
          let d = new Date(this.pedido.dataEntrega);
          d.setMinutes( d.getMinutes() + d.getTimezoneOffset() );
          this.pedidoForm.controls.dataEntrega.setValue(d);
          // Fim ajuste data

          this.pedidoForm.controls.tipoPedido.disable();
          this.pedidoForm.controls.codigoRepresentante.disable();
          this.pedidoForm.controls.codigoEmitente.disable();
          this.pedidoService.getCondicaoPagamento().subscribe(response => {
            if(response.erros){
              this.showMessage(response.erros[0].errorDescription, "Error");
            }else if(response.retorno.erros){
              this.showMessage(response.retorno.erros[0].errorDescription, "Error");
            }else{
              this.listaCondicoes = response.retorno.condicaoPagamento;
              let condicaoPagamento:CondicaoPagamento;
              condicaoPagamento = <CondicaoPagamento>this.listaCondicoes.filter( condPagto => condPagto.codigoCondicaoPagamento == this.pedido.codigoCondicaoPagamento)[0];
              if(condicaoPagamento){
                this.pedidoForm.controls.codigoCondicaoPagamento.setValue(<CondicaoPagamento>this.listaCondicoes.filter( condPagto => condPagto.codigoCondicaoPagamento == this.pedido.codigoCondicaoPagamento)[0]);
              }
              this.pedidoForm.controls.codigoCondicaoPagamento.enable();
              this.pedidoService.getItensTabelaPreco(this.pedidoForm.controls.numeroTabelaPreco.value).subscribe(response => {
                if(response.erros){
                  this.showMessage(response.erros[0].errorDescription, "Error");
                }else if(response.retorno.erros){
                  this.showMessage(response.retorno.erros[0].errorDescription, "Error");
                }else{
                  this.listaItemListaPreco = response.retorno.itensListaPreco;
                  this.isLoading = false;
                }
              });
            }
          });
        }

        if(this.copiando){
          this.pedidoForm.controls.situacaoPedido.setValue("DIGITADO");
          this.pedidoForm.controls.dataEmissao.setValue(this.datePipe.transform(new Date(), "dd/MM/yyyy"));
          this.pedidoForm.controls.dataEntrega.enable();
          this.pedidoForm.controls.tipoPedido.disable();
          this.pedidoForm.controls.codigoRepresentante.disable();
          this.pedidoForm.controls.codigoEmitente.disable();

          this.pedidoService.getProximoPedidoWeb().subscribe( response => {
            if(response){
              if(response.erros){
                this.showMessage(response.erros[0].errorDescription, "Error");
              }else if(response.retorno.erros){
                this.showMessage(response.retorno.erros[0].errorDescription, "Error");
              }else{
                this.pedidoForm.controls.numeroPedidoWeb.setValue( response.retorno.pedido[0].numeroPedidoWeb);
                this.pedidoService.getProximoPedidoCliente(this.pedido.codigoEmitente, this.pedido.tipoPedido).subscribe( response => {
                  if(response.erros){
                    this.showMessage(response.erros[0].errorDescription, "Error");
                  }else if(response.retorno.erros){
                    this.showMessage(response.retorno.erros[0].errorDescription, "Error");
                  }else{
                    this.pedidoForm.controls.pedidoCliente.setValue(response.retorno.pedido[0].numeroPedido);
                    this.pedidoService.getCondicaoPagamento().subscribe(response => {
                      if(response.erros){
                        this.showMessage(response.erros[0].errorDescription, "Error");
                      }else if(response.retorno.erros){
                        this.showMessage(response.retorno.erros[0].errorDescription, "Error");
                      }else{
                        this.listaCondicoes = response.retorno.condicaoPagamento;
                        let condicaoPagamento:CondicaoPagamento;
                        condicaoPagamento = <CondicaoPagamento>this.listaCondicoes.filter( condPagto => condPagto.codigoCondicaoPagamento == this.pedido.codigoCondicaoPagamento)[0];
                        if(condicaoPagamento){
                          this.pedidoForm.controls.codigoCondicaoPagamento.setValue(<CondicaoPagamento>this.listaCondicoes.filter( condPagto => condPagto.codigoCondicaoPagamento == this.pedido.codigoCondicaoPagamento)[0]);
                        }
                        this.pedidoForm.controls.codigoCondicaoPagamento.enable();
                        this.pedidoService.getItensTabelaPreco(this.pedidoForm.controls.numeroTabelaPreco.value).subscribe(response => {
                          if(response.erros){
                            this.showMessage(response.erros[0].errorDescription, "Error");
                          }else if(response.retorno.erros){
                            this.showMessage(response.retorno.erros[0].errorDescription, "Error");
                          }else{
                            this.listaItemListaPreco = response.retorno.itensListaPreco;
                            this.isLoading = false;
                          }
                        });
                      }
                    });
                  }
                });
              }
            }
          });
        }
      });
    }
  }

  private clearForm(){
    this.pedidoForm.controls.titulosVencidos.reset();
    this.pedidoForm.controls.titulosVencer.reset();
    this.pedidoForm.controls.cnpj.reset();
    this.pedidoForm.controls.email.reset();
    this.pedidoForm.controls.endereco.reset();
    this.pedidoForm.controls.pedidoCliente.reset();
    this.pedidoForm.controls.dataEntrega.reset();
    this.pedidoForm.controls.codigoCondicaoPagamento.reset();
    this.pedidoForm.controls.numeroTabelaPreco.reset();
    this.pedidoForm.controls.descricaoTabelaPreco.reset();
    this.pedidoForm.controls.observacoesCliente.reset();
    this.pedidoForm.controls.observacoesVendedor.reset();
    this.pedidoForm.controls.rowid.reset();

    this.filtraEmitentes("");
    this.listaItemListaPreco = null;
    this.dataSource.data = [];
    this.pedido.emitente = new Emitente();
  }

  private disableForm(){
    this.pedidoForm.controls.codigoEmitente.disable();
    this.pedidoForm.controls.pedidoCliente.disable();
    this.pedidoForm.controls.dataEntrega.disable();
    this.pedidoForm.controls.codigoCondicaoPagamento.disable();
    this.pedidoForm.controls.numeroTabelaPreco.disable();
    this.pedidoForm.controls.observacoesVendedor.disable();
  }

  private enableForm() {
    this.pedidoForm.controls.pedidoCliente.enable();
    this.pedidoForm.controls.dataEntrega.enable();
    this.pedidoForm.controls.codigoCondicaoPagamento.enable();
    this.pedidoForm.controls.observacoesVendedor.enable();
  }

  private createForm() {
    this.pedidoForm = this.formBuilder.group({
      codigoUsuario: [this.authService.getLoggedUserId(), Validators.required],
      numeroPedidoWeb: [0, Validators.required],
      tipoPedido: [0, Validators.required],
      situacaoPedido: [0,],
      codigoRepresentante: ["", Validators.required], 
      codigoEmitente: ["", Validators.required],
      titulosVencidos:  [0,],
      titulosVencer: [0,],
      cnpj: ["",],
      email: ["",],
      endereco: ["",],
      pedidoCliente: ["",Validators.required],
      dataEmissao: [this.getToday(),],
      dataEntrega: ["",Validators.required],    
      codigoCondicaoPagamento: ["", Validators.required],
      numeroTabelaPreco: ["",],
      descricaoTabelaPreco: ["",],
      observacoesCliente: ["",],
      observacoesVendedor: ["",],
      rowid: ["", ],     
    });

    this.pedidoForm.disable();

    if(!this.visualizando && !this.copiando){
      this.pedidoForm.controls.tipoPedido.valueChanges.subscribe(value => {
        if(value != null){
          this.clearForm();
          this.pedidoForm.controls.codigoRepresentante.reset();
          this.pedidoForm.controls.codigoEmitente.reset();
          this.disableForm();
          this.pedidoForm.controls.codigoRepresentante.disable();
        }
        this.pedidoForm.controls.codigoRepresentante.enable();
      });

      this.pedidoForm.controls.codigoRepresentante.valueChanges.subscribe(value => {
        if(value != null){
          this.clearForm();
          this.disableForm();
          let representante : Representante = this.listaRepresentantes.find( representante => representante.codigoRepresentante == this.pedidoForm.controls.codigoRepresentante.value.codigoRepresentante);
          if(!representante){
            this.pedidoForm.controls.codigoRepresentante.setErrors( {required: true } );
          }else{
            this.pedidoForm.controls.codigoEmitente.enable();
          }
        }
      });

      this.pedidoForm.controls.codigoEmitente.valueChanges.subscribe(value => {
        if(value != null){
          this.clearForm();
          let emitente : Emitente = this.listaEmitentes.find( emitente => emitente.codigoEmitente == this.pedidoForm.controls.codigoEmitente.value.codigoEmitente);
          if(!emitente){
            this.pedidoForm.controls.codigoEmitente.setErrors( {required: true } );
          }else{
            this.enableForm();
          }
          
        }
      });

      this.representanteService.retornaTodosRepresentantes().subscribe((listaRepresentanteRetorno) => { 
        if(listaRepresentanteRetorno.erros){
          this.showMessage(listaRepresentanteRetorno.erros[0].errorDescription, "Error");
          return;
        }
        this.listaRepresentantes = listaRepresentanteRetorno.retorno.representantes;

        this.pedidoService.getProximoPedidoWeb().subscribe( retorno => {
          if (retorno.erros){
            this.showMessage(retorno.erros[0].errorDescription, "Error");
            return;
          }
          this.pedidoForm.controls.numeroPedidoWeb.setValue(retorno.retorno.pedido[0].numeroPedidoWeb);
          this.filtraRepresentantes("");
          this.filtraEmitentes("");
          this.filtraCondicaoPagamento("");
          
          this.isLoading = false;
        });
      });
    }
  }

  private getToday(){
    let today = new Date();
    var dd = String(today.getDate()).padStart(2, '0');
    var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = today.getFullYear();
    
    return dd + '/' + mm + '/' + yyyy;
  }

  incluirItemPedido()
  {
    this.editarIncluirPedido(new ItemPedido(), false);
  }

  editarItemPedido(itemPedido: ItemPedido,$event)
  {
    $event.preventDefault();
    this.editarIncluirPedido(itemPedido, true);
  }

  consultarItemPedido(itemPedido: ItemPedido, $event){
    $event.preventDefault();
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "90%";
    dialogConfig.data = itemPedido;
    let itemPedidoComponent = this.dialog.open(ItemPedidoComponent,dialogConfig);
    itemPedidoComponent.componentInstance.visualizando = true;

  }

  editarIncluirPedido(itemPedido: ItemPedido, editando:boolean){
    var dialogConfig = new MatDialogConfig();
    dialogConfig.height = "auto";
    dialogConfig.width = "90%";
    dialogConfig.data = itemPedido;
    let itemPedidoComponent = this.dialog.open(ItemPedidoComponent,dialogConfig);
    itemPedidoComponent.componentInstance.listaItemListaPreco = this.listaItemListaPreco;
    itemPedidoComponent.componentInstance.editando = editando;
    itemPedidoComponent.afterClosed().subscribe((result) => {
      if (result!=undefined)
      {
        if (editando){
          this.dataSource.data.splice(this.dataSource.data.indexOf(itemPedido), 1, result);
        }else{
          this.dataSource.data.push(result);
        }
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.pedido.itens = <[ItemPedido]>this.dataSource.data;
      }
    });
  }

 removerItemPedido(itemPedido: ItemPedido,$event, indice)
  {
    $event.preventDefault();

    const confirmRemoveDialog = this.dialog.open(ConfirmModalComponent, {
      data: {
        title: "Confirmar exclusão de Item do Pedido",
        msg: `Tem certeza que deseja prosseguir com a exclusão do Item ${itemPedido.codigoItem} - ${itemPedido.descricaoItem}?`,
      },
    });

    confirmRemoveDialog.afterClosed().subscribe((result) => {
      if (result) {
        this.dataSource.data.splice(indice,1);
        this.dataSource.data = this.dataSource.data;
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
          return;
        }else{
          this.showMessage(result.ErrMsg);
          this.isLoading = false;
          this.router.navigate(['/listar']);
        }
      });
    }
    else {
      this.showMessage("Campos obrigatórios não foram preenchidos.", "Warn");
      event.preventDefault();
    }
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

  filtraRepresentantes(value: string)
  {
    const filterValue = value.toLowerCase();
    this.represantantesFiltrados = this.pedidoForm.controls.codigoRepresentante.valueChanges.pipe(
      startWith(''),
      map(x => {
        return this.listaRepresentantes ? this.listaRepresentantes.filter(option => option.nomeRepresentante.toString().trim().toLowerCase().indexOf(filterValue) !== -1) : [];
      })
    );
  }

  getCustomers(repres: Representante){
    this.isLoading = true;
    this.emitenteService.buscarEmitente(repres.codigoRepresentante, this.pedidoForm.controls.tipoPedido.value).subscribe((listaEmitenteRetorno) => { 
      if(listaEmitenteRetorno.erros){
        this.showMessage(listaEmitenteRetorno.erros[0].errorDescription, "Error");
        return;
      }
      this.listaEmitentes = listaEmitenteRetorno.retorno.emitentes;
      this.isLoading = false;
    });

  }

  displayEmitente(emitente: Emitente): string {
    return emitente && emitente.descricao ? emitente.descricao : '';
  }

  selecionaEmitente(event){
    let emitente : Emitente = event.option.value;

    this.isLoading = true;
    if (emitente){
      this.pedido.emitente = emitente;
      this.pedidoForm.controls.email.setValue(emitente.email);
      this.pedidoForm.controls.endereco.setValue(emitente.endereco);
      this.pedidoForm.controls.cnpj.setValue(emitente.cgc);
      this.pedidoForm.controls.observacoesCliente.setValue(emitente.observacoes);
      this.pedidoForm.controls.numeroTabelaPreco.setValue(emitente.numeroTabelaPreco);
      this.pedidoForm.controls.descricaoTabelaPreco.setValue(emitente.descTabelaPreco);
      this.pedidoForm.controls.codigoCondicaoPagamento.setValue(emitente.codigoCondicaoPagamento);
      
      //Consultar Dados de Títulos
      this.emitenteService.buscaTitulosEmitente(emitente.codigoEmitente).subscribe((dataResponse) => { 
        if (dataResponse.erros){
          this.showMessage(dataResponse.erros[0].errorDescription, "Error");
          return;
        }

        this.pedido.emitente.titulosEmitente = dataResponse.retorno.titulos[0];
        this.pedidoForm.controls.titulosVencidos.setValue( this.currencyFormat.format(dataResponse.retorno.titulos[0].valorVencido));
        this.pedidoForm.controls.titulosVencer.setValue( this.currencyFormat.format(dataResponse.retorno.titulos[0].valorAberto));
        if (this.pedido.emitente.titulosEmitente && this.pedido.emitente.titulosEmitente.listaTitulos){
          this.pedido.emitente.titulosEmitente.listaTitulos.forEach(titulo => {
            titulo.valorAberto = this.currencyFormat.format(parseFloat(titulo.valorAberto));
            titulo.valorVencido = this.currencyFormat.format(parseFloat(titulo.valorVencido));
            titulo.dataVencimentoFormatada = this.datePipe.transform(titulo.dataVencimento, "dd/MM/yyyy");
          });
        }

        //Busca próximo código de pedido para o cliente
        this.pedidoService.getProximoPedidoCliente(emitente.codigoEmitente, this.pedidoForm.controls.tipoPedido.value).subscribe( (dataResponse) => {
          if (dataResponse.erros){
            this.showMessage(dataResponse.erros[0].errorDescription, "Error");
            return;
          }
          this.pedidoForm.controls.pedidoCliente.setValue(dataResponse.retorno.pedido[0].numeroPedido);

          //Busca lista de condições de pagamento
          this.pedidoService.getCondicaoPagamento().subscribe(dataResponse => {
            if (dataResponse.erros){
              this.showMessage(dataResponse.erros[0].errorDescription, "Error");
              return;
            }
            this.listaCondicoes = dataResponse.retorno.condicaoPagamento;
            let condicaoPagamento:CondicaoPagamento;
            condicaoPagamento = <CondicaoPagamento>this.listaCondicoes.filter( condPagto => condPagto.codigoCondicaoPagamento == emitente.codigoCondicaoPagamento)[0];
            if(condicaoPagamento){
              this.pedidoForm.controls.codigoCondicaoPagamento.setValue(<CondicaoPagamento>this.listaCondicoes.filter( condPagto => condPagto.codigoCondicaoPagamento == emitente.codigoCondicaoPagamento)[0]);
            }

            this.pedidoService.getItensTabelaPreco(this.pedidoForm.controls.numeroTabelaPreco.value).subscribe(dataResponse => {
              if (dataResponse.erros){
                this.showMessage(dataResponse.erros[0].errorDescription, "Error");
                return;
              }
              this.listaItemListaPreco = dataResponse.retorno.itensListaPreco;
              this.isLoading = false;
            });
            
          });
        });
      });
    }
  }

  filtraEmitentes(value: string)
  {
    const filterValue = value.toLowerCase();
    this.emitentesFiltrados = this.pedidoForm.controls.codigoEmitente.valueChanges.pipe(
      startWith(''),
      map(x => {
        return this.listaEmitentes ? this.listaEmitentes.filter(emitente => emitente.descricao.toString().trim().toLowerCase().indexOf(filterValue) !== -1) : [];
      })
    );
  }

  private showMessage(msg: string, type: string = "Success") {
    this.isLoading = false;
    this.snackBar.openSnackBar(msg, null, type);
  }

  disableVisualizaTitulos(){
    return !(this.pedido 
          && this.pedido.emitente 
          && this.pedido.emitente.titulosEmitente 
          && this.pedido.emitente.titulosEmitente.listaTitulos
          );
  }

}