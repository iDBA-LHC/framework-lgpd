import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { TitulosEmitente } from './titulos_emitente';
import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';

export class PesquisaTituloRetorno extends AbstractIdbaResponseModel {
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        titulos: [TitulosEmitente]
    }
}
