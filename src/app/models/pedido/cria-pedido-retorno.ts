import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';

export class CriaPedidoRetorno extends AbstractIdbaResponseModel {
    retorno: {
        erros: [AbstractIdbaErrorsModel]
    }
}
