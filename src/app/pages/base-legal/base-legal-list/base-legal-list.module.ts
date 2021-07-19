import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLegalListComponent } from './base-legal-list.component'
import { BaseLegalListRoutingModule } from './base-legal-list-routing.module'
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [BaseLegalListComponent],
  imports: [
    CommonModule, BaseLegalListRoutingModule, SharedModule
  ]
})
export class BaseLegalListModule { }