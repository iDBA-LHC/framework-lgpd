import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiscoAssociadoListComponent } from './risco-associado-list.component';
import { RiscoAssociadoListRoutingModule } from './risco-associado-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [RiscoAssociadoListComponent],
  imports: [
    CommonModule, RiscoAssociadoListRoutingModule, SharedModule
  ]
})
export class RiscoAssociadoListModule { }
