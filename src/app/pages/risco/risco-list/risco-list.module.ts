import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiscoListComponent } from './risco-list.component';
import { RiscoListRoutingModule } from './risco-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [RiscoListComponent],
  imports: [
      CommonModule, RiscoListRoutingModule, SharedModule
  ]
})
export class RiscoListModule { }
