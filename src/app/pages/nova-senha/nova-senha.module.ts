import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NovaSenhaComponent } from './nova-senha.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NovaSenhaRoutingModule } from './nova-senha-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [NovaSenhaComponent],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    NovaSenhaRoutingModule,
    FormsModule,
    SharedModule,
  ],
})
export class NovaSenhaModule {}