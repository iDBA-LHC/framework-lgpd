import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CopiarPedidoRapidoComponent } from './copiar-pedido-rapido.component';
import { MatDialogModule, MatButtonModule } from '@angular/material';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule} from '@angular/forms';

@NgModule({
  declarations: [CopiarPedidoRapidoComponent],
  imports: [
    CommonModule, MatDialogModule, MatButtonModule, SharedModule, ReactiveFormsModule
  ]
})
export class CopiarPedidoRapidoModule { }
