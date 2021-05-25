import { ItemPedido } from './item-pedido';
import { Emitente } from '../emitente/emitente';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: "root",
  })

export class Pedido {
    codigoCondicaoPagamento: number;
    descricaoCondicaoPagamento: string;
    codigoEmitente: number;
    razaoSocial: string;
    codigoRepresentante: number;
    nomeRepresentante: string;
    dataEntrega: Date;
    dataEmissao: Date;
    dataImplantacao: Date;
    numeroPedido: string;
    numeroTabelaPreco: string;
    descricaoTabelaPreco: string;
    tipoPedido: number;
    observacao: string;
    valorTotalItens: number;
    valorTotalPedido: number;
    valorTotal: string;
    codigoUsuarioImplantacao: string;
    numeroPedidoWeb: number;
    dataHoraAtualizacao: Date;
    taxaNegociada: number;
    situacao: string;
    status: string;
    rowid: string;
    notasFiscais: string;
    itens: ItemPedido[];
    emitente: Emitente;
}
