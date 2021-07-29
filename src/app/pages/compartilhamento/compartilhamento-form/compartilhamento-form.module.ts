import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CompartilhamentoFormRoutingModule } from './compartilhamento-form-routing.module';
import { CompartilhamentoFormComponent } from './compartilhamento-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CompartilhamentoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CompartilhamentoFormRoutingModule,
    SharedModule
  ]
})
export class CompartilhamentoFormModule { }
