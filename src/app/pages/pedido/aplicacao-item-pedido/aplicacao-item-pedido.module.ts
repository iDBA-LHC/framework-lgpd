import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AplicacaoItemPedidoComponent } from './aplicacao-item-pedido.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [AplicacaoItemPedidoComponent],
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, SharedModule, ReactiveFormsModule
  ]
})
export class AplicacaoItemPedidoModule { }
