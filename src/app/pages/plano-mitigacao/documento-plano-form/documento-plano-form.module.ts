import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';
import { DocumentoPlanoFormRoutingModule } from './documento-plano-form-routing.module';
import { DocumentoPlanoFormComponent } from './documento-plano-form.component';



@NgModule({
  declarations: [DocumentoPlanoFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DocumentoPlanoFormRoutingModule,
    SharedModule
  ]
})
export class DocumentoPlanoFormModule { }
