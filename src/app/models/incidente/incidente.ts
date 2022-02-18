export class Incidente {
    codigoIncidente: number;
    codigoEmpresa: number;
    codigoUsuarioEncarregado: number;
    codigoUsuarioOperador: number;
    dataRegistro: Date;
    dataIncidente: Date;
    dataComunicacao: Date;
    desJustificativa: string;
    numeroProtocolo: string;
    indStatus: number;
    desTipoComunicacao: string;
    dadosAgenteTratamento: string;
    dadosNotificante: string;
    desDetalhes: string;
    desNaturezaDados: string;
    desTipoTitulares: string;
    desMedidasPreventivas: string;
    desMedidasMitigatorias: string;
    indRelatorioImpacto: number;
    desConsequencias: string;
    desLinkDocumento: string;

    nomeEmpresa: string;
    numeroCNPJEmpresa: string;
    nomeUsuarioOperador: string;
    nomeUsuarioEncarregado: string;
    emailUsuarioEncarregado: string;
}
