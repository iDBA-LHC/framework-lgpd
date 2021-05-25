import { NgModule, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { ListarPedidoComponent } from './listar-pedido.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ListarPedidoRoutingModule } from './listar-pedido-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [ ListarPedidoComponent],
  imports: [
    CommonModule, ReactiveFormsModule, SharedModule, ListarPedidoRoutingModule
  ],
  providers: [DatePipe]
})
export class ListarPedidoModule implements OnInit {

  ngOnInit() { 
    
  }
}
