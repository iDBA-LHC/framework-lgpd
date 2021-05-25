import { ItemListaPreco } from './item-lista-preco';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';

export class ListaItemTabelaPrecoRetorno extends AbstractIdbaResponseModel{
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        itensListaPreco: [ItemListaPreco]
    }
}
