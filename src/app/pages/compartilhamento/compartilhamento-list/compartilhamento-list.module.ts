import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompartilhamentoListRoutingModule } from './compartilhamento-list-routing.module';
import { CompartilhamentoListComponent } from './compartilhamento-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CompartilhamentoListComponent],
  imports: [
    CommonModule,
    CompartilhamentoListRoutingModule,
    SharedModule
  ]
})
export class CompartilhamentoListModule { }
