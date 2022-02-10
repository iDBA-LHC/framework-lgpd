import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SolicitacaoTitularFormComponent } from './solicitacao-titular-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { SolicitacaoTitularFormRoutingModule } from './solicitacao-titular-form-routing.module';



@NgModule({
  declarations: [SolicitacaoTitularFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule,
    SolicitacaoTitularFormRoutingModule
  ]
})
export class SolicitacaoTitularFormModule { }
