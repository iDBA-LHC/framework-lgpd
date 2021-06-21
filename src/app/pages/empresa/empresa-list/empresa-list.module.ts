import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmpresaListComponent } from './empresa-list.component';
import { EmpresaListRoutingModule } from './empresa-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [EmpresaListComponent],
  imports: [
    CommonModule, EmpresaListRoutingModule, SharedModule
  ]
})
export class EmpresaListModule { }
