import { AplicacaoItem } from './aplicacao-item';

export class ItemPedido {
    numeroPedidoWeb: number;
    codigoItem: string;
    descricaoItem: string;
    unidadeMedida: string;
    sequenciaItem: number;
    sequenciaPedido: number;
    quantidadeItem: number;
    precoUnitario: number;
    precoTotal: number;
    tipoPedido: number;
    indBonificado: number;
    precoTabela: number;
    aplicacoes: AplicacaoItem[];
}
 