import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AmeacaListComponent } from './ameaca-list.component';
import { AmeacaListRoutingModule } from './ameaca-list-routing.module';
import { SharedModule } from 'src/app/shared/shared.module';

@NgModule({
  declarations: [AmeacaListComponent],
  imports: [
      CommonModule, AmeacaListRoutingModule, SharedModule
  ]
})
export class AmeacaListModule { }
