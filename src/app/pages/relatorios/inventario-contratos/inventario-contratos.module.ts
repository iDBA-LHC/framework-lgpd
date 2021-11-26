import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InventarioContratosRoutingModule } from './inventario-contratos-routing.module';
import { InventarioContratosComponent } from './inventario-contratos.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { ReactiveFormsModule } from '@angular/forms';



@NgModule({
  declarations: [InventarioContratosComponent],
  imports: [
    CommonModule, InventarioContratosRoutingModule, ReactiveFormsModule, SharedModule
  ]
})
export class InventarioContratosModule { }
