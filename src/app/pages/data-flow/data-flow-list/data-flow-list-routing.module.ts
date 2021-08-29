import { NgModule } from '@angular/core';
import { DataFlowListComponent } from './data-flow-list.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
  {
    path: "",
    component: DataFlowListComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataFlowListRoutingModule { }
