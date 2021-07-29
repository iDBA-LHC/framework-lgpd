import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LocalArmazenamentoFormRoutingModule } from './local-armazenamento-form-routing.module';
import { LocalArmazenamentoFormComponent } from './local-armazenamento-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [LocalArmazenamentoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LocalArmazenamentoFormRoutingModule,
    SharedModule
  ]
})
export class LocalArmazenamentoFormModule { }
