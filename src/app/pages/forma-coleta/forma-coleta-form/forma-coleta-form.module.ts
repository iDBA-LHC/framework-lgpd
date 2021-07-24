import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormaColetaFormComponent } from './forma-coleta-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { FormaColetaFormRoutingModule } from './forma-coleta-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [FormaColetaFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormaColetaFormRoutingModule,
    SharedModule,
  ],
})

export class FormaColetaFormModule { }
