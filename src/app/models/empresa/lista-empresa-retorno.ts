import { AbstractIdbaResponseModel } from 'src/app/shared/models/abstract-idba-response-model';
import { AbstractIdbaErrorsModel } from 'src/app/shared/models/abstract-idba-errors-model';
import { Empresa } from './empresa';

export class ListaEmpresaRetorno extends AbstractIdbaResponseModel {
    retorno: {
        erros: [AbstractIdbaErrorsModel],
        empresas: [Empresa]
    }
}
