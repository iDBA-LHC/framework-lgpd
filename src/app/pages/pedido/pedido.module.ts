import { NgModule, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { PedidoComponent } from './pedido.component';
import { PedidoRoutingModule } from './pedido-routing.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [PedidoComponent],
  imports: [
    CommonModule, ReactiveFormsModule, PedidoRoutingModule, SharedModule
  ],
  providers: [DatePipe]
})
export class PedidoModule implements OnInit {

  ngOnInit() { 
    
  }

}
