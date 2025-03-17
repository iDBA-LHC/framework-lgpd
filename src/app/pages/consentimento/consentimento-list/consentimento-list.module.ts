import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ConsentimentoListComponent } from './consentimento-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ConsentimentoListRoutingModule } from './consentimento-list-routing.module';



@NgModule({
  declarations: [ConsentimentoListComponent],
  imports: [CommonModule, ConsentimentoListRoutingModule, SharedModule],
})
export class ConsentimentoListModule { }
