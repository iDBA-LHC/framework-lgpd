
import { NgModule } from '@angular/core';

import { Routes, RouterModule } from '@angular/router';
import { DataFlowFormComponent } from './data-flow-form.component';

const routes: Routes = [
  {
    path: "",
    component: DataFlowFormComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DataFlowFormRoutingModule { }
