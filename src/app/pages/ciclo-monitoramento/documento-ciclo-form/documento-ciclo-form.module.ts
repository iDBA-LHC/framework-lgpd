import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DocumentoCicloFormComponent } from './documento-ciclo-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentoCicloFormRoutingModule } from './documento-ciclo-form-routing.module';

@NgModule({
  declarations: [DocumentoCicloFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentoCicloFormRoutingModule,
    SharedModule
  ]
})
export class DocumentoCicloFormModule { }
