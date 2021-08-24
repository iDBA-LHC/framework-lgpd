import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CicloMonitoramentoFormRoutingModule } from './ciclo-monitoramento-form-routing.module';
import { CicloMonitoramentoFormComponent } from './ciclo-monitoramento-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CicloMonitoramentoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CicloMonitoramentoFormRoutingModule,
    SharedModule
  ]
})
export class CicloMonitoramentoFormModule { }
