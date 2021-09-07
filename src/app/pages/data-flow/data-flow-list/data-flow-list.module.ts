import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataFlowListComponent } from './data-flow-list.component';
import { DataFlowListRoutingModule } from './data-flow-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [DataFlowListComponent],
  imports: [
    CommonModule, DataFlowListRoutingModule, SharedModule
  ]
})
export class DataFlowListModule { }
