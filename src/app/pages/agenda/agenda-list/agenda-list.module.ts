import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from 'src/app/shared/shared.module';
import { AgendaListRoutingModule } from './agenda-list-routing.module';
import { AgendaListComponent } from './agenda-list.component';



@NgModule({
  declarations: [AgendaListComponent],
  imports: [
    CommonModule,  SharedModule, AgendaListRoutingModule
  ]
})
export class AgendaListModule { }
