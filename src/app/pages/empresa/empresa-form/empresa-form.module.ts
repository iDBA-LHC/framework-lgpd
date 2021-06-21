import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaFormComponent } from './empresa-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { EmpresaFormRoutingModule } from './empresa-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [EmpresaFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    EmpresaFormRoutingModule,
    SharedModule,
  ],
})

export class EmpresaFormModule { }
