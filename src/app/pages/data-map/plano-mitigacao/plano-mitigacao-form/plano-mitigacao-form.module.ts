import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanoMitigacaoFormRoutingModule } from './plano-mitigacao-form-routing.module';
import { PlanoMitigacaoFormComponent } from './plano-mitigacao-form.component';



@NgModule({
  declarations: [PlanoMitigacaoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    PlanoMitigacaoFormRoutingModule,
    SharedModule
  ]
})
export class PlanoMitigacaoFormModule { }
