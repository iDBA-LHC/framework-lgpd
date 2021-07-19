import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CicloDeVidaListComponent } from './ciclo-de-vida-list.component'
import { CicloDeVidaListRoutingModule } from './ciclo-de-vida-list-routing.module'
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [CicloDeVidaListComponent],
  imports: [
    CommonModule, CicloDeVidaListRoutingModule, SharedModule
  ]
})
export class CicloDeVidaListModule { }