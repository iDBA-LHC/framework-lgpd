import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DataFlowFormComponent } from './data-flow-form.component';
import { DataFlowFormRoutingModule } from './data-flow-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [DataFlowFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DataFlowFormRoutingModule,
    SharedModule,
  ],
})

export class DataFlowFormModule { }
