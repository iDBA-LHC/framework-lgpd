import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CicloDeVidaFormComponent } from './ciclo-de-vida-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { CicloDeVidaFormRoutingModule } from './ciclo-de-vida-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';


@NgModule({
  declarations: [CicloDeVidaFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    CicloDeVidaFormRoutingModule,
    SharedModule,
  ],
})

export class CicloDeVidaFormModule { }
