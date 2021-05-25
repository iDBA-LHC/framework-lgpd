import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { Emitente } from './emitente';

export class PesquisaEmitenteRetorno extends AbstractIdbaResponseModel {
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        emitentes: [Emitente]
    }
}
