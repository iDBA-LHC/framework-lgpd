import { TitulosEmitente } from './titulos_emitente';
import { CondicaoPagamento } from '../pedido/condicao-pagamento';
import { ListaPreco } from '../pedido/lista-preco';

export class Emitente {
    codigoEmitente: number;
    nomeEmitente: string;
    nomeAbrev: string;
    descricao: string;
    cgc: string;
    endereco: string;
    email: string;
    observacoes: string;
    numeroTabelaPreco: string;
    descTabelaPreco: string;
    codigoCondicaoPagamento: number;
    estado: string;
    pais: string;
    titulosEmitente: TitulosEmitente;
    listaCondicaoPagamento: [CondicaoPagamento];
    listaTabelaPreco: [ListaPreco];
}
