import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RIPDListComponent } from './ripd-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { RIPDListRoutingModule } from './ripd-list-routing.module';



@NgModule({
  declarations: [RIPDListComponent],
  imports: [CommonModule, RIPDListRoutingModule, SharedModule],
})
export class RIPDListModule { }
