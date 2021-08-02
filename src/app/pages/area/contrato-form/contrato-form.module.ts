import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ContratoFormRoutingModule } from './contrato-form-routing.module';
import { ContratoFormComponent } from './contrato-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [ContratoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ContratoFormRoutingModule,
    SharedModule
  ]
})
export class ContratoFormModule { }
