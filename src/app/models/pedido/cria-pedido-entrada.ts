import { AbstractIdbaRequestModel } from 'src/app/shared/models/abstract-idba-request-model';
import { Pedido } from './pedido';

export class CriaPedidoEntrada extends AbstractIdbaRequestModel {
    parameters: {Pedido: [Pedido]}
}
