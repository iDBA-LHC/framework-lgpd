import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthService } from './auth.service';

import { AbstractIdbaRequestModel } from 'src/app/shared/models/abstract-idba-request-model';
import { environment } from 'src/environments/environment';
import { ListaPedidoRetorno } from '../models/pedido/lista-pedido-retorno';
import { ListaPedidoEntrada } from '../models/pedido/lista-pedido-entrada';
import { Pedido } from '../models/pedido/pedido';
import { ListaCondicaoPagamentoRetorno } from '../models/pedido/lista-condicao-pagamento-retorno';
import { ListaTabelaPrecoRetorno } from '../models/pedido/lista-tabela-preco-retorno';
import { ListaItemTabelaPrecoRetorno } from '../models/pedido/lista-item-tabela-preco-retorno';
import { AbstractIdbaResponseModel } from '../shared/models/abstract-idba-response-model';
import { SalvarPedidoRetorno } from '../models/pedido/salvar-pedido-retorno';
import { EliminarPedidoRetorno } from '../models/pedido/eliminar-pedido-retorno.ts';

@Injectable({
  providedIn: 'root'
})
export class PedidoService {

  constructor(private http: HttpClient,
              private authService: AuthService,) { }

  getProximoPedidoWeb(){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaProxPedidoWeb.p";
    entrada.user    = this.authService.getLoggedUserName();
    return this.http.post<ListaPedidoRetorno>(environment.apiURL, entrada);
  }
 
  getProximoPedidoCliente(codigoEmitente:number, tipoPedido:number ){
    var entrada = new ListaPedidoEntrada();
    entrada.program = "pedido-web/buscaProxPedidoCliente.p";
    entrada.user    = this.authService.getLoggedUserName();
    let pedido = new Pedido();
    pedido.codigoEmitente = codigoEmitente;
    pedido.tipoPedido = tipoPedido;
    entrada.parameters = {};
    entrada.parameters['pedido'] = pedido;
    return this.http.post<ListaPedidoRetorno>(environment.apiURL, entrada);
  }

  getCondicaoPagamento(){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaCondicaoPagamento.p";
    entrada.user    = this.authService.getLoggedUserName();
    return this.http.post<ListaCondicaoPagamentoRetorno>(environment.apiURL, entrada);
  }

  getTabelaPreco(tipoTabelaPreco: number){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaTabelaPreco.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters = {};
    entrada.parameters['tipoTabelaPreco'] = tipoTabelaPreco == 2 ? 'MKT' : "";
    return this.http.post<ListaTabelaPrecoRetorno>(environment.apiURL, entrada);
  }

  getItensTabelaPreco(numeroTabelaPreco: string){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaItensTabelaPreco.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters['numeroTabelaPreco'] = numeroTabelaPreco;
    return this.http.post<ListaItemTabelaPrecoRetorno>(environment.apiURL, entrada);
  }

  savePedido(pedido:Pedido){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/salvaPedido.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters = {};
    let pedidoWeb = {};
    pedidoWeb['codigoCondicaoPagamento'] = pedido.codigoCondicaoPagamento;
    pedidoWeb['codigoEmitente'] = pedido.codigoEmitente;
    pedidoWeb['codigoRepresentante'] = pedido.codigoRepresentante;
    pedidoWeb['dataEntrega'] = pedido.dataEntrega;
    pedidoWeb['dataEmissao'] = this.toDate(pedido.dataEmissao);
    pedidoWeb['dataImplantacao'] = pedido.dataImplantacao;
    pedidoWeb['numeroPedido'] = pedido.numeroPedido;
    pedidoWeb['numeroTabelaPreco'] = pedido.numeroTabelaPreco;
    pedidoWeb['tipoPedido'] = pedido.tipoPedido;
    pedidoWeb['observacao'] = pedido.observacao;
    pedidoWeb['codigoUsuarioImplantacao'] = pedido.codigoUsuarioImplantacao;
    pedidoWeb['numeroPedidoWeb'] = pedido.numeroPedidoWeb;
    pedidoWeb['dataHoraAtualizacao'] = pedido.dataHoraAtualizacao;
    pedidoWeb['taxaNegociada'] = pedido.taxaNegociada;
    pedido.itens.forEach( (item, index) => {
      item.numeroPedidoWeb = pedido.numeroPedidoWeb;
      item.sequenciaItem   = index + 1;
      pedido.valorTotalItens  =+ item.precoTotal;
      pedido.valorTotalPedido =+ item.precoTotal;
      if(item.indBonificado == 1){
        item.tipoPedido = 3;
      }else{
        item.tipoPedido = pedido.tipoPedido;
      }
      item.aplicacoes.forEach( aplicacao => { 
        aplicacao.numeroPedidoWeb = item.numeroPedidoWeb;
        aplicacao.codigoItem      = item.codigoItem; 
        aplicacao.sequenciaItem   = item.sequenciaItem;
      });
    });
    pedidoWeb['itens'] = pedido.itens;
    pedidoWeb['valorTotalItens'] = pedido.valorTotalItens;
    pedidoWeb['valorTotalPedido'] = pedido.valorTotalPedido;

    entrada.parameters['pedido'] = {};
    entrada.parameters['pedido']['pedido'] = []
    entrada.parameters['pedido']['pedido'][0] = pedidoWeb;  
    return this.http.post<SalvarPedidoRetorno>(environment.apiURL, entrada);
  }

  getPedidos(filtro : {} = {}){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaPedidos.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters = {filtro};
    return this.http.post<ListaPedidoRetorno>(environment.apiURL, entrada);
  }

  getPedido(rowid : String){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/buscaPedido.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters = {rowid};
    return this.http.post<ListaPedidoRetorno>(environment.apiURL, entrada);
  }

  deletePedido(rowid : String){
    var entrada = new AbstractIdbaRequestModel();
    entrada.program = "pedido-web/eliminaPedido.p";
    entrada.user    = this.authService.getLoggedUserName();
    entrada.parameters = {rowid};
    return this.http.post<EliminarPedidoRetorno>(environment.apiURL, entrada);
  }

  private toDate(dateStr) {
    var parts = dateStr.split("/");
    return new Date(parts[2], parts[1] - 1, parts[0]);
}

}
