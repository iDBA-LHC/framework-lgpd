import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuditoriaListComponent } from './auditoria-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { AuditoriaListRoutingModule } from './auditoria-list-routing.module';



@NgModule({
  declarations: [AuditoriaListComponent],
  imports: [CommonModule, AuditoriaListRoutingModule, SharedModule],
})
export class AuditoriaListModule { }
