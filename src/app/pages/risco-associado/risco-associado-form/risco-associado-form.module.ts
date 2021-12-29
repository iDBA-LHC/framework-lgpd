import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RiscoAssociadoFormComponent } from './risco-associado-form.component';
import { RiscoAssociadoFormRoutingModule } from './risco-associado-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [RiscoAssociadoFormComponent],
  imports: [
    CommonModule, RiscoAssociadoFormRoutingModule, SharedModule, ReactiveFormsModule
  ]
})
export class RiscoAssociadoFormModule { }
