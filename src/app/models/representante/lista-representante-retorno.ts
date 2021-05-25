import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { Representante } from './representante';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';

export class ListaRepresentanteRetorno extends AbstractIdbaResponseModel {
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        representantes: [Representante]
    }
}
