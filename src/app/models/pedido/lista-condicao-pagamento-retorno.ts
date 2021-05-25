import { CondicaoPagamento } from './condicao-pagamento';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';

export class ListaCondicaoPagamentoRetorno extends AbstractIdbaResponseModel{
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        condicaoPagamento: [CondicaoPagamento]
    }
}
