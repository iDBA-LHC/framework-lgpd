import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { AbstractIdbaErrorsModel } from './abstract-idba-errors-model';

export class AbstractIdbaResponseModel {
    OutputPars: string;
    ErrMsg: string;
    erros: [AbstractIdbaErrorsModel];
}
