import { ListaPreco } from './lista-preco';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';

export class ListaTabelaPrecoRetorno extends AbstractIdbaResponseModel{
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        listaPreco: [ListaPreco]
    }
}
