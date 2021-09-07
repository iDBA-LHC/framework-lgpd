import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataMapFormRoutingModule } from './data-map-form-routing.module';
import { DataMapFormComponent } from './data-map-form.component';



@NgModule({
  declarations: [DataMapFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataMapFormRoutingModule,
    SharedModule
  ]
})
export class DataMapFormModule { }
