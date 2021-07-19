import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AreaListComponent } from './area-list.component';
import { AreaListRoutingModule } from './area-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';



@NgModule({
  declarations: [AreaListComponent],
  imports: [
    CommonModule, AreaListRoutingModule, SharedModule
  ]
})
export class AreaListModule { }
