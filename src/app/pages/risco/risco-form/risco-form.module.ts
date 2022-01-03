import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiscoFormComponent } from './risco-form.component';
import { RiscoFormRoutingModule } from './risco-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [RiscoFormComponent],
  imports: [
      CommonModule, RiscoFormRoutingModule, SharedModule, ReactiveFormsModule
  ]
})
export class RiscoFormModule { }
