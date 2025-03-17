import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataDiscoveryListComponent } from './data-discovery-list.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { DataDiscoveryListRoutingModule } from './data-discovery-list-routing.module';



@NgModule({
  declarations: [DataDiscoveryListComponent],
  imports: [CommonModule, DataDiscoveryListRoutingModule, SharedModule],
})
export class DataDiscoveryListModule { }
