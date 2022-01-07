import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MapaRiscosComponent } from './mapa-riscos.component';
import { MapaRiscosRoutingModule } from './mapa-riscos-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [MapaRiscosComponent],
  imports: [
    CommonModule, MapaRiscosRoutingModule, ReactiveFormsModule, SharedModule
  ]
})
export class MapaRiscosModule { }
