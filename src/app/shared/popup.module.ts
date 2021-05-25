import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemPedidoModule } from '../pages/pedido/item-pedido/item-pedido.module';
import { ListarTituloModule } from '../pages/pedido/listar-titulo/listar-titulo.module';
import { CopiarPedidoRapidoModule } from '../pages/pedido/copiar-pedido-rapido/copiar-pedido-rapido.module';
import { AplicacaoItemPedidoModule } from '../pages/pedido/aplicacao-item-pedido/aplicacao-item-pedido.module';
import { TarefaAgendaFormModule } from '../pages/agenda/tarefa-agenda/tarefa-agenda-form.module';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,ItemPedidoModule, ListarTituloModule, CopiarPedidoRapidoModule, AplicacaoItemPedidoModule, TarefaAgendaFormModule
  ]
})
export class PopupModule { }
