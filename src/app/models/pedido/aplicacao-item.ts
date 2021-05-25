export class AplicacaoItem {
    numeroPedidoWeb: number;
    codigoItem: string;
    sequenciaItem: number;
    sequenciaPedido: number;
    codigoAplicacao: string;
    descricaoAplicacao: string;
    sequencial: number;
    percentual: number;

    constructor(codigoAplicacao:string = "", descricaoAplicacao: string = ""){
        this.codigoAplicacao = codigoAplicacao;
        this.descricaoAplicacao = descricaoAplicacao;
    }
}
