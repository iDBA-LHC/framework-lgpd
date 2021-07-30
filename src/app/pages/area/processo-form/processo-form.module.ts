import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProcessoFormRoutingModule } from './processo-form-routing.module';
import { ProcessoFormComponent } from './processo-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [ProcessoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ProcessoFormRoutingModule,
    SharedModule
  ]
})
export class ProcessoFormModule { }
