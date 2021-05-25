import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { Pedido } from './pedido';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';

export class ListaPedidoRetorno extends AbstractIdbaResponseModel{
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        pedido: Pedido[]
    }
}
