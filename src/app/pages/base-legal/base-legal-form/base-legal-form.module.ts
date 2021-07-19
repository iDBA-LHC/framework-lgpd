import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BaseLegalFormComponent } from './base-legal-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { BaseLegalFormRoutingModule } from './base-legal-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [BaseLegalFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BaseLegalFormRoutingModule,
    SharedModule,
  ],
})

export class BaseLegalFormModule { }
