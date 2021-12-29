import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmeacaFormComponent } from './ameaca-form.component';
import { AmeacaFormRoutingModule } from './ameaca-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [AmeacaFormComponent],
  imports: [
      CommonModule, AmeacaFormRoutingModule, SharedModule, ReactiveFormsModule
  ]
})
export class AmeacaFormModule { }
