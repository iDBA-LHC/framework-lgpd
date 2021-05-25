import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { Pedido } from './pedido';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';

export class SalvarPedidoRetorno extends AbstractIdbaResponseModel{
    retorno: {
        erros: [AbstractIdbaErrorsModel],
    }
}
