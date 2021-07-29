import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalArmazenamentoListRoutingModule } from './local-armazenamento-list-routing.module';
import { LocalArmazenamentoListComponent } from './local-armazenamento-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LocalArmazenamentoListComponent],
  imports: [
    CommonModule,
    LocalArmazenamentoListRoutingModule,
    SharedModule
  ]
})
export class LocalArmazenamentoListModule { }
