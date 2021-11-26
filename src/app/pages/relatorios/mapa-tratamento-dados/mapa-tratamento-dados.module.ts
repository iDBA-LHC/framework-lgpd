import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaTratamentoDadosRoutingModule } from './mapa-tratamento-dados-routing.module';
import { MapaTratamentoDadosComponent } from './mapa-tratamento-dados.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [MapaTratamentoDadosComponent],
  imports: [
    CommonModule, MapaTratamentoDadosRoutingModule, ReactiveFormsModule, SharedModule
  ]
})
export class MapaTratamentoDadosModule { }
