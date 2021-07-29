import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MetadadosFormComponent } from './metadados-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MetadadosFormRoutingModule } from '../../metadados/metadados-form/metadados-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [MetadadosFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MetadadosFormRoutingModule,
    SharedModule,
  ]
})
export class MetadadosFormModule { }
