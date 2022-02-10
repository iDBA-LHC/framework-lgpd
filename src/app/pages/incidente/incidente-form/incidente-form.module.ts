import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IncidenteFormComponent } from './incidente-form.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { IncidenteFormRoutingModule } from './incidente-form-routing.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [IncidenteFormComponent],
  imports: [
    CommonModule,
    SharedModule, 
    IncidenteFormRoutingModule,
    ReactiveFormsModule
  ]
})
export class IncidenteFormModule { }
