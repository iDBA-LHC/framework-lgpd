import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaFormComponent } from './area-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AreaFormRoutingModule } from './area-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [AreaFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    AreaFormRoutingModule,
    SharedModule,
  ],
})

export class AreaFormModule { }
