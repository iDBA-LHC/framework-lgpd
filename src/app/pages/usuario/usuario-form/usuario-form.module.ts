import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UsuarioFormComponent } from './usuario-form.component';
import { UsuarioFormRoutingModule } from './usuario-form-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [UsuarioFormComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UsuarioFormRoutingModule,
    SharedModule,
  ],
})
export class UsuarioFormModule { }
