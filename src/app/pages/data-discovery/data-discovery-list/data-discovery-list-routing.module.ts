import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';
import { DataDiscoveryListComponent } from './data-discovery-list.component';

const routes: Routes = [
  {
    path: "",
    component: DataDiscoveryListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})

export class DataDiscoveryListRoutingModule { }
