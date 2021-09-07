import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CicloMonitoramentoListRoutingModule } from './ciclo-monitoramento-list-routing.module';
import { CicloMonitoramentoListComponent } from './ciclo-monitoramento-list.component';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CicloMonitoramentoListComponent],
  imports: [
    CommonModule,
    CicloMonitoramentoListRoutingModule,
    SharedModule
  ]
})
export class CicloMonitoramentoListModule { }
