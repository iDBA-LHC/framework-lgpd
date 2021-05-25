import { AbstractIdbaRequestModel } from 'src/app/shared/models/abstract-idba-request-model';

export class PesquisaEmpresaEntrada extends AbstractIdbaRequestModel{
    parameters: { rowid: string; }
}
