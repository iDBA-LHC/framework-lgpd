import { AbstractIdbaRequestModel } from 'src/app/shared/models/abstract-idba-request-model';
import { Empresa } from './empresa';

export class AlteraEmpresaEntrada extends AbstractIdbaRequestModel {
    parameters: {empresas: [Empresa]}
}
