import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RelatorioRIPDComponent } from './relatorio-ripd.component';
import { RelatorioRIPDRoutingModule } from './relatorio-ripd-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [RelatorioRIPDComponent],
  imports: [
    CommonModule, RelatorioRIPDRoutingModule, ReactiveFormsModule, SharedModule
  ]
})
export class RelatorioRIPDModule { }
