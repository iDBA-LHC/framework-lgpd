import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { PlanoMitigacaoListRoutingModule } from './plano-mitigacao-list-routing.module';
import { PlanoMitigacaoListComponent } from './plano-mitigacao-list.component';



@NgModule({
  declarations: [PlanoMitigacaoListComponent],
  imports: [
    CommonModule,
    PlanoMitigacaoListRoutingModule,
    SharedModule
  ]
})
export class PlanoMitigacaoListModule { }
