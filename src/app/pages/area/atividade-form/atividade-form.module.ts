import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AtividadeFormRoutingModule } from './atividade-form-routing.module';
import { AtividadeFormComponent } from './atividade-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AtividadeFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AtividadeFormRoutingModule,
    SharedModule
  ]
})
export class AtividadeFormModule { }
