import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { AplicacaoItem } from '../pedido/aplicacao-item';

export class ListaAplicacaoRetorno extends AbstractIdbaResponseModel{
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        aplicacoesItem: [AplicacaoItem]
    }
}
