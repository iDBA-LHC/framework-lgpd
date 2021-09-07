import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataMapListRoutingModule } from './data-map-list-routing.module';
import { DataMapListComponent } from './data-map-list.component';



@NgModule({
  declarations: [DataMapListComponent],
  imports: [
    CommonModule,
    DataMapListRoutingModule,
    SharedModule
  ]
})
export class DataMapListModule { }
