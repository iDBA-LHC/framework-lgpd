import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MudaSenhaComponent } from './muda-senha.component';
import { MudaSenhaRoutingModule } from './muda-senha-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [MudaSenhaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MudaSenhaRoutingModule,
    SharedModule,
  ]
})
export class MudaSenhaModule { }
